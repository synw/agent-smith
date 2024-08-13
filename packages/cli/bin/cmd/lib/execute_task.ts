import { initAgent, taskReader } from "../../agent.js";
import logUpdate from "log-update";
import { getFeatureSpec } from "../../state/features.js";
import { FeatureType } from "../../interfaces.js";
import { runMode } from "../../state/state.js";

async function executeTaskCmd(args: Array<string> = [], options: any = {}): Promise<any> {
    await initAgent(runMode.value);
    const name = args.shift()!;
    //console.log("Task Args", args);
    const { found, path } = getFeatureSpec(name, "task" as FeatureType);
    if (!found) {
        return { ok: false, data: {}, error: `Task ${name} not found` };
    }
    //console.log("EFM", brain.expertsForModels);
    const task = taskReader.init(path);
    //console.log("TB", task.b)
    const pr = args.shift()!;
    const vars: Record<string, string> = {};
    args.forEach((a) => {
        if (a.includes("=")) {
            const t = a.split("=");
            vars[t[0]] = t[1];
        }
    })
    logUpdate("Ingesting prompt ...");
    const data = await task.run({ prompt: pr, ...vars }) as Record<string, any>;
    if (data?.error) {
        return { ok: false, data: {}, error: `Error executing task: ${data.error}` }
    }
    return { ok: true, data: data.text, error: "" }
}

export { executeTaskCmd }