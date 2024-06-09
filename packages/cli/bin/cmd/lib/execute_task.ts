import { taskReader } from "../../agent.js";
import logUpdate from "log-update";
import { getFeatureSpec } from "../../state/features.js";
import { FeatureType } from "../../interfaces.js";

async function executeTaskCmd(args: Array<string> = [], options: any = {}): Promise<any> {
    const name = args.shift()!;
    const { found, path } = getFeatureSpec(name, "task" as FeatureType);
    if (!found) {
        return { ok: false, data: {}, error: `Task ${name} not found` };
    }
    //console.log("EFM", brain.expertsForModels);
    const task = taskReader.read(path);
    //console.log("TB", task.b)
    logUpdate("Ingesting prompt ...");
    const data = await task.run({ prompt: args[0] }) as Record<string, any>;
    if (data?.error) {
        return { ok: false, data: {}, error: `Error executing task: ${data.error}` }
    }
    return { ok: true, data: data.text, error: "" }
}

export { executeTaskCmd }