import { brain, initAgent, taskBuilder } from "../../agent.js";
import { getFeatureSpec } from "../../state/features.js";
import { FeatureType } from "../../interfaces.js";
import { isChatMode, isDebug } from "../../state/state.js";
import { initTaskConf, initTaskParams, initTaskVars, parseInputOptions, readTask } from "./utils.js";


async function executeTaskCmd(args: Array<string> | Record<string, any> = [], options: any = {}): Promise<any> {
    //console.log("TARGS", args);
    await initAgent();
    if (isDebug.value) {
        console.log("Task args:", args);
        console.log("Task options:", options);
    }
    const isJob = !Array.isArray(args);
    let name: string;
    let pr: string;
    if (!isJob) {
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
        if (!args.name) {
            throw new Error("Provide a task name param")
        }
        if (!args.prompt) {
            throw new Error("Provide a task prompt param")
        }
        name = args.name;
        delete args.name;
        pr = args.prompt;
        delete args.prompt;
    }
    const { found, path } = getFeatureSpec(name, "task" as FeatureType);
    if (!found) {
        return { ok: false, data: "", conf: {}, error: `Task ${name} not found` };
    }
    //console.log("EFM", brain.expertsForModels);    
    const res = readTask(path);
    if (!res.found) {
        throw new Error(`Task ${name}, ${path} not found`)
    }
    const taskSpec = taskBuilder.readFromYaml(res.ymlTask);
    const task = taskBuilder.fromYaml(res.ymlTask);
    let conf: Record<string, any> = {};
    let vars: Record<string, any> = {};
    if (!isJob) {
        const tv = initTaskVars(args, taskSpec?.inferParams ? taskSpec.inferParams as Record<string, any> : {});
        conf = tv.conf;
        vars = tv.vars;
    } else {
        const tv = initTaskParams(args, taskSpec?.inferParams ? taskSpec.inferParams as Record<string, any> : {});
        conf = tv.conf;
        vars = tv.vars;
    }
    conf = initTaskConf(conf, taskSpec);
    if (isDebug.value) {
        console.log("Task conf:", conf);
        console.log("Task vars:", vars);
    }
    const ex = brain.getOrCreateExpertForModel(conf.model.name, conf.model.template);
    //console.log("EFM", ex?.name);
    if (!ex) {
        throw new Error("No expert found for model " + conf.model.name)
    }
    ex.checkStatus();
    //ex.backend.setOnStartEmit(() => console.log("[START]"));
    let i = 0;
    ex.backend.setOnToken((t) => {
        if (i == 0) {
            if (t == "\n\n") {
                return
            }
        }
        ++i;
        process.stdout.write(t)
    });
    conf.expert = ex;
    if (isDebug.value) {
        conf.debug = true;
    }
    const data = await task.run({ prompt: pr, ...vars }, conf) as Record<string, any>;
    if (data?.error) {
        return { ok: false, data: "", conf: conf, error: `Error executing task: ${name} ${data.error}` }
    }
    conf.prompt = pr;
    // chat mode
    if (isChatMode.value) {
        if (brain.ex.name != ex.name) {
            brain.setDefaultExpert(ex);
        }
        brain.ex.template.pushToHistory({ user: pr, assistant: data.text });
    }
    return { ok: true, data: data.text, conf: conf, error: "" }
}

export { executeTaskCmd }