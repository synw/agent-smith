import { initAgent, taskBuilder } from "../../agent.js";
import { getFeatureSpec } from "../../state/features.js";
import { FeatureType } from "../../interfaces.js";
import { runMode } from "../../state/state.js";
import { readTask } from "./utils.js";

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
    const task = taskBuilder.fromYaml(res.ymlTask);
    //console.log("TB", task.b)
    const pr = args.shift()!;
    const vars: Record<string, string> = {};
    args.forEach((a) => {
        if (a.includes("=")) {
            const t = a.split("=");
            vars[t[0]] = t[1];
        }
    })
    console.log("Ingesting prompt ...");
    //console.log("Vars", vars);
    const data = await task.run({ prompt: pr, ...vars }) as Record<string, any>;
    if (data?.error) {
        return { ok: false, data: {}, error: `Error executing task: ${data.error}` }
    }
    return { ok: true, data: data.text, error: "" }
}

export { executeTaskCmd }