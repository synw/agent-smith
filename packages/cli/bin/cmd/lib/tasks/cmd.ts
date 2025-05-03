//import { LmTask, LmTaskConf, LmTaskOutput, LmTaskToolSpec, ModelSpec } from "../../../../../lmtask/dist/main.js";
import { LmTask, LmTaskConf, LmTaskOutput, LmTaskToolSpec, ModelSpec } from "@agent-smith/lmtask";
import { compile, serializeGrammar } from "@intrinsicai/gbnfgen";
import YAML from 'yaml';
import { brain, initAgent, taskBuilder } from "../../../agent.js";
import { readTool } from "../../../db/read.js";
import { FeatureType, LmTaskFileSpec } from "../../../interfaces.js";
import { getFeatureSpec } from "../../../state/features.js";
import { isChatMode, isDebug, isShowTokens, isVerbose } from "../../../state/state.js";
import { readTask } from "../../sys/read_task.js";
import { executeActionCmd, } from "../actions/cmd.js";
import { formatStats, parseInputOptions } from "../utils.js";
import { executeWorkflowCmd } from "../workflows/cmd.js";
import { configureTaskModel, mergeInferParams } from "./conf.js";
import { parseArgs } from "../../../primitives/args.js";

async function executeTaskCmd(
    args: Array<string> | Record<string, any> = [], options: Record<string, any> = {}
): Promise<LmTaskOutput> {
    //console.log("TARGS", args);
    await initAgent();
    if (isDebug.value) {
        console.log("Task args:", args);
        console.log("Task options:", options);
    }
    const isWorkflow = !Array.isArray(args);
    let name: string;
    let pr: string;
    if (!isWorkflow) {
        name = args.shift()!;
        //const params = args.filter((x) => x.length > 0);
        //console.log("TaskARGS", args);
        const _pr = await parseInputOptions(options);
        //console.log("PROMPT:", _pr);
        //const { inferenceVars, currentArgs } = parseInferenceArgs(args);
        //sconsole.log("IV", inferenceVars, "CA", currentArgs);
        if (!_pr) {
            const p = args.shift();
            if (p) {
                pr = p
            } else {
                throw new Error("Please provide a prompt")
            }
        } else {
            pr = _pr;
        }
        //console.log("TaskARGS F", args);
    } else {
        //console.log("TW ARGS", args);
        if (!(args?.name)) {
            throw new Error("Provide a task name param")
        }
        if (!(args?.prompt)) {
            throw new Error("Provide a task prompt param")
        }
        name = args.name;
        //delete args.name;
        pr = args.prompt;
        //delete args.prompt;
    }
    //console.log("TARGS", args);
    const { found, path } = getFeatureSpec(name, "task" as FeatureType);
    if (!found) {
        throw new Error(`Task ${name} not found`);
    }
    //console.log("EFM", brain.expertsForModels);    
    const res = readTask(path);
    if (!res.found) {
        throw new Error(`Task ${name}, ${path} not found`)
    }
    //const taskRawSpec = taskBuilder.readFromYaml(res.ymlTask);
    const taskFileSpec = YAML.parse(res.ymlTask) as LmTaskFileSpec;
    // model
    //console.log("ARGSIN", args);
    const { conf, vars } = parseArgs(args);
    //console.log("PCONF", conf);
    //console.log("PVARS", vars);
    conf.inferParams = mergeInferParams(conf.inferParams, taskFileSpec.inferParams ?? {});
    const model = configureTaskModel(conf, taskFileSpec);
    /*if (!isWorkflow) {
        const { conf, vars } = parseArgs(args);
        conf.inferParams = mergeInferParams(conf.inferParams);
        //const tv = parseTaskVars(args, taskFileSpec?.inferParams ? taskFileSpec.inferParams as Record<string, any> : {});
        model = configureTaskModel(conf, taskFileSpec);
    } else {
        //console.log("TV IN", args);
        const { conf, vars } = parseArgs(args);
        const tv = parseTaskVars({ name: name, prompt: pr, ...args }, taskFileSpec?.inferParams ? taskFileSpec.inferParams as Record<string, any> : {});
        vars = tv.vars;
        model = configureTaskModel(tv.conf, taskFileSpec);
    }*/
    //console.log("V", Object.keys(vars));
    //console.log("MODEL", model);
    // tools
    const taskSpec = taskFileSpec as LmTask;
    //console.log("Task tools list:", taskSpec.toolsList);
    if (taskSpec.toolsList) {
        taskSpec.tools = []
        for (const toolName of taskSpec.toolsList) {
            const { found, tool, type } = readTool(toolName);
            if (!found) {
                throw new Error(`tool ${toolName} not found for task ${taskSpec.name}`);
            }
            //console.log("Tool found:", toolName, tool);
            const lmTool: LmTaskToolSpec = {
                ...tool,
                execute: async (args) => {
                    //console.log("Execute tool", type, toolName, args);
                    switch (type) {
                        case "action":
                            const res = await executeActionCmd([toolName, ...Object.values(args)], options, true);
                            return res
                        case "task":
                            const tres = await executeTaskCmd([toolName, args], options);
                            return tres
                        case "workflow":
                            const wres = await executeWorkflowCmd(toolName, ...Object.values(args), options);
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
    if (isDebug.value) {
        console.log("Task model:", model);
        console.log("Task vars:", vars);
    }
    // expert
    const ex = brain.getOrCreateExpertForModel(model.name, model.template);
    if (!ex) {
        throw new Error("No expert found for model " + model.name)
    }
    ex.checkStatus();
    //ex.backend.setOnStartEmit(() => console.log("[START]"));
    let i = 0;
    let c = false;
    if (options?.onToken) {
        ex.backend.setOnToken(options.onToken);
    } else {
        ex.backend.setOnToken((t) => {
            let txt = t;
            if (isShowTokens.value) {
                txt = c ? t : `\x1b[100m${t}\x1b[0m`
            }
            process.stdout.write(txt);
            ++i;
            c = !c
        });
    }
    const tconf: LmTaskConf = {
        expert: ex,
        model: model,
        debug: isDebug.value,
        ...conf,
    }
    tconf.expert = ex;
    if (isDebug.value || isVerbose.value) {
        tconf.debug = true;
    }
    let out: LmTaskOutput;
    try {
        out = await task.run({ prompt: pr, ...vars }, tconf);
        console.log()
    }
    catch (err) {
        throw new Error(`Error executing task: ${name} ${err}`);
    }
    // chat mode
    if (isChatMode.value) {
        if (brain.ex.name != ex.name) {
            brain.setDefaultExpert(ex);
        }
        brain.ex.template.pushToHistory({ user: pr, assistant: out.answer.text });
    }
    if (isDebug.value || isVerbose.value) {
        console.log("\n", formatStats(out.answer.stats))
    }
    return out
}

export { executeTaskCmd };
