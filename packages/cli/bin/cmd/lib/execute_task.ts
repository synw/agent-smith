import { brain, initAgent, taskBuilder } from "../../agent.js";
import { getFeatureSpec } from "../../state/features.js";
import { FeatureType } from "../../interfaces.js";
import { runMode } from "../../state/state.js";
import { readTask } from "./utils.js";
//import { useLmExpert } from "../../../../brain/src/expert.js";
//import { LmExpert } from "../../../../brain/src/interfaces.js";
//import { useLmExpert, LmExpert } from "@agent-smith/brain";

async function executeTaskCmd(args: Array<string> = [], options: any = {}): Promise<any> {
    await initAgent(runMode.value);
    const name = args.shift()!;
    //console.log("Task Args", args);
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
    //const ex = brain.getOrCreateExpertForModel(taskSpec.model.name, taskSpec.template.name);
    //console.log("TB", task.b)
    const pr = args.shift()!;
    const vars: Record<string, any> = {};
    args.forEach((a) => {
        if (a.includes("=")) {
            const t = a.split("=");
            vars[t[0]] = t[1];
        }
    })
    const ex = brain.getOrCreateExpertForModel(taskSpec.model.name, taskSpec.template.name);
    //console.log("EFM", ex?.name);
    if (!ex) {
        throw new Error("No expert found for model " + taskSpec.model.name)
    }
    ex.checkStatus();
    ex.backend.setOnToken((t) => {
        process.stdout.write(t)
    });
    vars["expert"] = ex;
    console.log("Ingesting prompt ...");
    //console.log("Vars", vars);
    const data = await task.run({ prompt: pr, ...vars }) as Record<string, any>;
    if (data?.error) {
        return { ok: false, data: {}, error: `Error executing task: ${data.error}` }
    }
    return { ok: true, data: data.text, error: "" }
}

export { executeTaskCmd }