import { brain, initAgent, taskBuilder } from "../../agent.js";
import { getFeatureSpec } from "../../state/features.js";
import { FeatureType } from "../../interfaces.js";
import { runMode } from "../../state/state.js";
import { initTaskVars, readTask } from "./utils.js";
import { readClipboard } from "../sys/clipboard.js";

async function executeTaskCmd(args: Array<string> = [], options: any = {}): Promise<any> {
    await initAgent(runMode.value);
    //console.log("Task args:", args);
    //console.log("Task options:", options);
    const name = args.shift()!;
    const params = args.filter((x) => x.length > 0);
    //console.log("Task run params", params);
    let pr: string;
    if (options?.Ic == true) {
        //console.log("Input copy option");
        pr = await readClipboard()
    }
    else if (params.length > 0) {
        pr = params.shift()!;
    } else {
        throw new Error("Please provide a prompt")
    }
    const { found, path } = getFeatureSpec(name, "task" as FeatureType);
    if (!found) {
        return { ok: false, data: {}, error: `Task ${name} not found` };
    }
    //console.log("EFM", brain.expertsForModels);    
    const res = readTask(path);
    if (!res.found) {
        throw new Error(`Task ${name}, ${path} not found`)
    }
    const taskSpec = taskBuilder.readFromYaml(res.ymlTask);
    const task = taskBuilder.fromYaml(res.ymlTask);
    const { conf, vars } = initTaskVars(args);
    const ex = brain.getOrCreateExpertForModel(taskSpec.model.name, taskSpec.template.name);
    //console.log("EFM", ex?.name);
    if (!ex) {
        throw new Error("No expert found for model " + taskSpec.model.name)
    }
    ex.checkStatus();
    ex.backend.setOnToken((t) => {
        process.stdout.write(t)
    });
    conf.expert = ex;
    console.log("Ingesting prompt ...");
    //console.log("Vars", vars);
    const data = await task.run({ prompt: pr, ...vars }, conf) as Record<string, any>;
    if (data?.error) {
        return { ok: false, data: {}, error: `Error executing task: ${data.error}` }
    }
    return { ok: true, data: data.text, error: "" }
}

export { executeTaskCmd }