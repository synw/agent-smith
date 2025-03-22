import { brain, initAgent, taskBuilder } from "../../../agent.js";
import { getFeatureSpec } from "../../../state/features.js";
import { FeatureType } from "../../../interfaces.js";
import { isChatMode, isDebug, isShowTokens, isVerbose } from "../../../state/state.js";
import { initTaskConf, initTaskParams, initTaskVars, parseInputOptions } from "../utils.js";
import { readTask } from "../../sys/read_task.js";
import { readTool } from "../../../db/read.js";
import { LmTaskOutput, LmTaskToolSpec } from "@agent-smith/lmtask";
import { executeActionCmd, } from "../actions/cmd.js";
import { executeWorkflowCmd } from "../workflows/cmd.js";


async function executeTaskCmd(
    args: Array<string> | Record<string, any> = [], options: any = {}
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
        //console.log("Task run params", params);
        const _pr = await parseInputOptions(options);
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
    } else {
        //console.log("ARGS", args)
        if (!(args?.name)) {
            throw new Error("Provide a task name param")
        }
        if (!(args?.prompt)) {
            throw new Error("Provide a task prompt param")
        }
        name = args.name;
        delete args.name;
        pr = args.prompt;
        delete args.prompt;
    }
    const { found, path } = getFeatureSpec(name, "task" as FeatureType);
    if (!found) {
        throw new Error(`Task ${name} not found`);
    }
    //console.log("EFM", brain.expertsForModels);    
    const res = readTask(path);
    if (!res.found) {
        throw new Error(`Task ${name}, ${path} not found`)
    }
    const taskSpec = taskBuilder.readFromYaml(res.ymlTask);
    if (taskSpec.toolsList) {
        taskSpec.tools = []
        for (const toolName of taskSpec.toolsList) {
            const { found, tool, type } = readTool(toolName);
            const lmTool: LmTaskToolSpec = {
                ...tool,
                execute: async (name, args) => {
                    switch (type) {
                        case "action":
                            const res = await executeActionCmd([name, ...Object.values(args)], options, true);
                            return res
                        case "task":
                            const tres = await executeTaskCmd([name, args], options);
                            return tres
                        case "workflow":
                            const wres = await executeWorkflowCmd(name, ...Object.values(args), options);
                            return wres
                        default:
                            throw new Error(`unknown tool execution function type: ${type}`)
                    }
                }
            }
            if (!found) {
                console.warn(`Problem: tool ${toolName} not found for task ${taskSpec.name}`);
                continue
            }
            taskSpec.tools.push(lmTool)
        }
        delete taskSpec.toolsList
    };
    //console.log("TASK SPEC:", JSON.stringify(taskSpec, null, "  "));
    const task = taskBuilder.init(taskSpec);
    let conf: Record<string, any> = {};
    let vars: Record<string, any> = {};
    //console.log("TARGS", args);
    if (!isWorkflow) {
        const tv = initTaskVars(args, taskSpec?.inferParams ? taskSpec.inferParams as Record<string, any> : {});
        conf = tv.conf;
        vars = tv.vars;
    } else {
        const tv = initTaskParams({ name: name, prompt: pr, ...args }, taskSpec?.inferParams ? taskSpec.inferParams as Record<string, any> : {});
        conf = tv.conf;
        vars = tv.vars;
    }
    conf = initTaskConf(conf, taskSpec);
    if (isDebug.value) {
        console.log("Task conf:", conf);
        console.log("Task vars:", vars);
    }
    const ex = brain.getOrCreateExpertForModel(conf.model.name, conf.model.template);
    if (!ex) {
        throw new Error("No expert found for model " + conf.model.name)
    }
    ex.checkStatus();
    //ex.backend.setOnStartEmit(() => console.log("[START]"));
    let i = 0;
    let c = false;
    ex.backend.setOnToken((t) => {
        let txt = t;
        if (isShowTokens.value) {
            txt = c ? t : `\x1b[100m${t}\x1b[0m`
        }
        process.stdout.write(txt);
        ++i;
        c = !c
    });
    conf.expert = ex;
    if (isDebug.value || isVerbose.value) {
        conf.debug = true;
    }
    let out: LmTaskOutput;
    try {
        out = await task.run({ prompt: pr, ...vars }, conf);
        console.log()
    }
    catch (err) {
        throw new Error(`Error executing task: ${name} ${err}`);
    }
    conf.prompt = pr;
    // chat mode
    if (isChatMode.value) {
        if (brain.ex.name != ex.name) {
            brain.setDefaultExpert(ex);
        }
        brain.ex.template.pushToHistory({ user: pr, assistant: out.answer.text });
    }
    if (isDebug.value) {
        console.log("\n", out.answer.stats)
    }
    return out
}

export { executeTaskCmd }