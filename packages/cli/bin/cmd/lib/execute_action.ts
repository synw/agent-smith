import { AgentTask } from "@agent-smith/jobs";
import { processOutput } from './utils.js';
import { getFeatureSpec } from '../../state/features.js';
import { FeatureType } from "../../interfaces.js";

async function executeActionCmd(args: Array<string> = [], options: any = {}, quiet = false): Promise<any> {
    const name = args.shift()!;
    const { found, path, ext } = getFeatureSpec(name, "action" as FeatureType);
    if (!found) {
        return { ok: false, data: {}, error: "FeatureType not found" };
    }
    let act: AgentTask;
    if (ext == "js") {
        const { action } = await import(path);
        act = action as AgentTask;
    } else {
        throw new Error(`Action ext ${ext} not implemented`)
    }
    const res = await act.run(args);
    if (!quiet) {
        console.log(res.data);
    }
    await processOutput(res.data);
    return { ok: true, data: res.data, error: "" }
}

export { executeActionCmd };
