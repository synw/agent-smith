import { Agent } from "@agent-smith/agent";
import { ModelSpec, Task, TaskConf, TaskDef } from "@agent-smith/task";
import { compile, serializeGrammar } from "@intrinsicai/gbnfgen";
import { ToolSpec } from "@locallm/types";
import { readTool } from "../../../db/read.js";
import { executeAction } from "../actions/cmd.js";
import { McpClient } from "../mcp.js";
import { parseTaskConfigOptions } from "../options_parsers.js";
import { executeWorkflow } from "../workflows/cmd.js";
import { executeTask } from "./cmd.js";
import { configureTaskModel, mergeInferParams } from "./conf.js";
import { openTaskSpec } from "./utils.js";
import { confirmToolUsage } from "../tools.js";

async function readTask(
    name: string, payload: Record<string, any>, options: Record<string, any>, agent: Agent
): Promise<{
    task: Task;
    model: ModelSpec;
    conf: TaskConf;
    vars: Record<string, any>;
    mcpServers: Array<McpClient>;
}> {
    if (options?.debug) {
        console.log("Task", name);
        console.log("Payload:", payload);
        console.log("Task options:", options);
    }
    const taskFileSpec = openTaskSpec(name);
    // merge passed options from payload
    const opts = payload?.inferParams ? { ...options, ...payload.inferParams } : options
    const conf = parseTaskConfigOptions(opts);
    if (options?.debug) {
        console.log("Task conf:", conf);
        conf.debug = true;
    }
    conf.inferParams = mergeInferParams(conf.inferParams, taskFileSpec.inferParams ?? {});
    const model = configureTaskModel(conf, taskFileSpec);
    if (options?.ctx) {
        model.ctx = options.ctx
    }
    // vars
    const taskSpec = taskFileSpec as TaskDef;
    let vars: Record<string, any> = {};
    if (taskSpec?.variables?.optional) {
        for (const k of Object.keys(taskSpec.variables.optional)) {
            if (k in options) {
                vars[k] = options[k]
            } else if (k in payload) {
                vars[k] = payload[k]
            }
        }
    }
    if (taskSpec?.variables?.required) {
        for (const k of Object.keys(taskSpec.variables.required)) {
            //console.log("TASK V required:", Object.keys(taskSpec.variables.required), "/", k in options, "/", k in payload);
            if (k in options) {
                vars[k] = options[k]
            } else if (k in payload) {
                vars[k] = payload[k]
            }
        }
    }
    const mcpServers = new Array<McpClient>();
    if (!taskSpec?.tools) {
        taskSpec.tools = []
    }
    // mcp tools
    if (taskFileSpec?.mcp) {
        for (const [servername, tool] of Object.entries(taskFileSpec.mcp)) {
            //console.log("MCP TOOL:", tool)
            const authorizedTools = new Array<string>();
            const askUserTools = new Array<string>();
            if (tool?.tools) {
                (tool.tools as Array<string>).forEach(t => {
                    let tn = t;
                    if (t.endsWith("?")) {
                        tn = t.slice(0, -1);
                        askUserTools.push(tn)
                    }
                    authorizedTools.push(tn)
                });
            }
            const mcp = new McpClient(
                servername,
                tool.command,
                tool.arguments,
                authorizedTools.length > 0 ? authorizedTools : null,
                askUserTools.length > 0 ? askUserTools : null,
            );
            mcpServers.push(mcp);
            await mcp.start();
            const tools = await mcp.extractTools();
            tools.forEach(t => taskSpec.tools?.push(t))
        }
    }
    // tools
    //console.log("Task tools list:", taskSpec.toolsList);
    if (taskSpec.toolsList) {
        for (const rawToolName of taskSpec.toolsList) {
            let toolName = rawToolName;
            let autoRunTool = true;
            if (rawToolName.endsWith("?")) {
                autoRunTool = false;
                toolName = rawToolName.slice(0, -1);
            }
            const { found, tool, type } = readTool(toolName);
            if (!found) {
                throw new Error(`tool ${toolName} not found for task ${taskSpec.name}`);
            }
            //console.log("Tool found:", toolName, tool);
            const quiet = !options?.debug;
            const lmTool: ToolSpec = {
                ...tool,
                execute: async (params) => {
                    //console.log("EXEC TOOL:", toolName, params);
                    switch (type) {
                        case "action":
                            const res = await executeAction(toolName, params as Record<string, any>, options, quiet);
                            return res
                        case "task":
                            options.isToolCall = true;
                            const tres = await executeTask(toolName, params as Record<string, any>, options);
                            options.isToolCall = false;
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
            if (!autoRunTool) {
                lmTool.canRun = confirmToolUsage
            }
            taskSpec.tools.push(lmTool)
        }
        delete taskSpec.toolsList
    };
    //console.log("TASK SPEC:", JSON.stringify(taskSpec, null, "  "));
    const task = new Task(agent, taskSpec);
    //task.addTools(taskSpec.tools);
    //console.log("TASK TOOLS", task.agent.tools);
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
};

