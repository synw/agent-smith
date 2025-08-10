//import { LmTask, LmTaskInput, LmTaskOutput, LmTaskToolSpec, ModelSpec } from "@agent-smith/lmtask";
import { LmTask, LmTaskInput, LmTaskOutput, LmTaskToolSpec, ModelSpec } from "../../../../../lmtask/dist/main.js"
import { compile, serializeGrammar } from "@intrinsicai/gbnfgen";
import { taskBuilder } from "../../../agent.js";
import { readTool } from "../../../db/read.js";
import { executeAction } from "../actions/cmd.js";
import { McpClient } from "../mcp.js";
import { parseTaskConfigOptions } from "../options_parsers.js";
import { executeWorkflow } from "../workflows/cmd.js";
import { configureTaskModel, mergeInferParams } from "./conf.js";
import { openTaskSpec } from "./utils.js";
import { executeTask } from "./cmd.js";
import { AgentTask } from "@agent-smith/jobs/dist/interfaces.js";
import { FeatureType, LmTaskConfig } from "../../../interfaces.js";

async function readTask(
    name: string, payload: Record<string, any>, options: Record<string, any>
): Promise<{
    task: AgentTask<FeatureType, LmTaskInput, LmTaskOutput, Record<string, any>>;
    model: ModelSpec;
    conf: LmTaskConfig;
    vars: Record<string, any>;
    mcpServers: Array<McpClient>;
}> {
    if (options?.debug) {
        console.log("Payload:", payload);
        console.log("Task options:", options);
    }
    const taskFileSpec = openTaskSpec(name);
    // merge passed options from payload
    const opts = payload?.inferParams ? { ...options, ...payload.inferParams } : options
    const conf = parseTaskConfigOptions(opts);
    if (options?.debug) {
        console.log("conf:", conf);
    }
    conf.inferParams = mergeInferParams(conf.inferParams, taskFileSpec.inferParams ?? {});
    const model = configureTaskModel(conf, taskFileSpec);
    if (options?.ctx) {
        model.ctx = options.ctx
    }
    // vars
    const taskSpec = taskFileSpec as LmTask;
    let vars: Record<string, any> = {};
    taskSpec.variables?.optional?.forEach(k => {
        if (k in options) {
            vars[k] = options[k]
        }
    });
    taskSpec.variables?.required?.forEach(k => {
        if (k in options) {
            vars[k] = options[k]
        }
    });
    const mcpServers = new Array<McpClient>();
    // mcp tools
    if (taskFileSpec?.mcp) {
        taskSpec.tools = []
        for (const [servername, tool] of Object.entries(taskFileSpec.mcp)) {
            //console.log("MCP server:", tool)
            const mcp = new McpClient(servername, tool.command, tool.args, tool?.tools ?? null);
            mcpServers.push(mcp);
            await mcp.start();
            const tools = await mcp.extractTools();
            tools.forEach(t => taskSpec.tools?.push(t))
        }
    }
    // tools
    //console.log("Task tools list:", taskSpec.toolsList);
    if (taskSpec.toolsList) {
        if (!taskSpec?.tools) {
            taskSpec.tools = []
        }
        for (const toolName of taskSpec.toolsList) {
            const { found, tool, type } = readTool(toolName);
            if (!found) {
                throw new Error(`tool ${toolName} not found for task ${taskSpec.name}`);
            }
            //console.log("Tool found:", toolName, tool);
            const lmTool: LmTaskToolSpec = {
                ...tool,
                execute: async (params) => {
                    switch (type) {
                        case "action":
                            const res = await executeAction(toolName, params, options, true);
                            return res
                        case "task":
                            conf.quiet = !options?.debug;
                            const tres = await executeTask(name, params, options, true);
                            //console.log("WFTRESP", tres.answer.text);
                            return tres.answer.text
                        case "workflow":
                            const wres = await executeWorkflow(toolName, params, options);
                            return wres
                        default:
                            throw new Error(`unknown tool execution function type: ${type} for ${toolName}`)
                    }
                }
            }
            taskSpec.tools.push(lmTool)
        }
        delete taskSpec.toolsList
    };
    //console.log("TASK SPEC:", JSON.stringify(taskSpec, null, "  "));
    const task = taskBuilder.init(taskSpec);
    // check for grammars
    if (model?.inferParams?.tsGrammar) {
        //console.log("TSG");
        model.inferParams.grammar = serializeGrammar(await compile(model.inferParams.tsGrammar, "Grammar"));
        delete model.inferParams.tsGrammar;
    }
    /*if (options?.debug) {
        console.log("Task model:", model);
        //console.log("Task vars:", vars);
    }*/
    return { task, model, conf, vars, mcpServers }
}

export {
    readTask
}
