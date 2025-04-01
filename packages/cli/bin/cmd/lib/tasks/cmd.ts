//import { LmTask, LmTaskBuilder, LmTaskOutput, LmTaskToolSpec } from "../../../../../lmtask/dist/main.js";
import { compile, serializeGrammar } from "@intrinsicai/gbnfgen";
import { LmTask, LmTaskBuilder, LmTaskOutput, LmTaskToolSpec } from "@agent-smith/lmtask";
import { brain, initAgent, taskBuilder } from "../../../agent.js";
import { getFeatureSpec } from "../../../state/features.js";
import { FeatureType } from "../../../interfaces.js";
import { isChatMode, isDebug, isShowTokens, isVerbose } from "../../../state/state.js";
import { formatStats, initTaskConf, initTaskParams, initTaskVars, parseInputOptions } from "../utils.js";
import { readTask } from "../../sys/read_task.js";
import { readFeature, readTool } from "../../../db/read.js";
import { executeActionCmd, } from "../actions/cmd.js";
import { executeWorkflowCmd } from "../workflows/cmd.js";
import { readModelsFile } from "../../../cmd/sys/read_models.js";


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
    const taskRawSpec = taskBuilder.readSpecFromYaml(res.ymlTask);
    let taskSpec: LmTask;
    // modelset
    let defaultCtx: number;
    if (taskRawSpec?.modelset) {
        const modelsFeat = readFeature(taskRawSpec.modelset.name, "modelset");
        if (!modelsFeat.found) {
            throw new Error(`modelset feature ${taskRawSpec.modelset.name} not found in conf db`)
        }
        const { found, ctx, max_tokens, models } = readModelsFile(
            modelsFeat.feature.path + "/" + modelsFeat.feature.name + "." + modelsFeat.feature.ext
        );
        if (!found) {
            throw new Error(`modelset ${taskRawSpec.modelset.name} not found`)
        }
        defaultCtx = ctx;
        for (const [k, v] of Object.entries(models)) {
            if (!v?.ctx) {
                v.ctx = ctx;
                models[k] = v;
            }
        }
        taskRawSpec.model = models[taskRawSpec.modelset.default];
        if (!taskRawSpec.model) {
            throw new Error(`model ${taskRawSpec.modelset.default} not found`)
        }
        if (!taskRawSpec.model?.ctx) {
            taskRawSpec.model.ctx = ctx
        }
        if (!taskRawSpec?.inferParams?.max_tokens) {
            if (!taskRawSpec?.inferParams) {
                taskRawSpec.inferParams = {}
            }
            taskRawSpec.inferParams.max_tokens = max_tokens;
        }
        taskRawSpec.models = models;
        taskSpec = LmTaskBuilder.fromRawSpec(taskRawSpec);
    } else {
        taskSpec = taskRawSpec as LmTask;
        if (!taskSpec.model?.ctx) {
            throw new Error(`provide a ctx parameter in the task default model`)
        }
        defaultCtx = taskSpec.model.ctx;
    }
    //console.log("TASK SPEC", taskSpec);
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
    conf = initTaskConf(conf, taskSpec, defaultCtx);
    // check for grammars
    if (conf?.inferParams?.tsGrammar) {
        console.log("TSG");
        conf.inferParams.grammar = serializeGrammar(await compile(conf.inferParams.tsGrammar, "Grammar"));
        delete conf.inferParams.tsGrammar;
    }
    if (isDebug.value) {
        console.log("Task conf:", conf);
        console.log("Task vars:", vars);
    }
    // expert
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
    if (isDebug.value || isVerbose.value) {
        console.log("\n", formatStats(out.answer.stats))
    }
    return out
}

export { executeTaskCmd }