import { brain, initAgent, taskBuilder } from "../../agent.js";
import { getFeatureSpec } from "../../state/features.js";
import { FeatureType } from "../../interfaces.js";
import { isChatMode, isDebug } from "../../state/state.js";
import { initTaskVars, parseInputOptions, readTask } from "./utils.js";
import { useTemplateForModel } from "@agent-smith/tfm";

const tfm = useTemplateForModel();

async function executeTaskCmd(args: Array<string> = [], options: any = {}): Promise<any> {
    await initAgent();
    if (isDebug.value) {
        console.log("Task args:", args);
        console.log("Task options:", options);
    }
    const name = args.shift()!;
    const params = args.filter((x) => x.length > 0);
    //console.log("Task run params", params);
    let pr = await parseInputOptions(options);
    if (!pr) {
        const p = params.shift();
        if (p) {
            pr = p
        }
    }
    if (!pr) {
        throw new Error("Please provide a prompt")
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
    const { conf, vars } = initTaskVars(args, taskSpec?.inferParams ? taskSpec.inferParams as Record<string, any> : {});
    if (isDebug.value) {
        console.log("Task conf:", conf);
        console.log("Task vars:", vars);
    }
    let m = taskSpec.model.name;
    let t: string = taskSpec.model.template;
    let c = taskSpec.model.ctx;
    if (conf?.model) {
        m = conf.model
        if (conf?.template) {
            t = conf.template
        } else {
            const gt = tfm.guess(m);
            if (gt == "none") {
                throw new Error(`Unable to guess the template for ${conf.model}: please provide a template name"`)
            }
            t = gt
        }
    } else {
        if (conf?.size) {
            if (!taskSpec?.models) {
                throw new Error(`Model ${conf.size} not found in task`)
            }
            if (!Object.keys(taskSpec.models).includes(conf.size)) {
                throw new Error(`Model ${conf.size} not found in task`)
            }
            m = taskSpec.models[conf.size].name;
            t = taskSpec.models[conf.size].template;
            c = taskSpec.models[conf.size].ctx;
        }
    }
    conf.model = {
        name: m,
        template: t,
        ctx: c,
    };
    if (isDebug.value) {
        console.log("Model:", conf.model);
    }
    const ex = brain.getOrCreateExpertForModel(m, t);
    //console.log("EFM", ex?.name);
    if (!ex) {
        throw new Error("No expert found for model " + m)
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
        return { ok: false, data: "", conf: conf, error: `Error executing task: ${data.error}` }
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