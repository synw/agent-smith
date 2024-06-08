import { AgentTask } from "@agent-smith/jobs";
import { processOutput } from './utils.js';
import { getFeaturePath } from '../../state/features.js';
import { FeatureType } from "../../interfaces.js";

async function executeActionCmd(args: Array<string> = [], options: any = {}, quiet = false): Promise<any> {
    const name = args.shift()!;
    const { found, fpath } = getFeaturePath(name, "action" as FeatureType);
    if (!found) {
        return { ok: false, data: {}, error: "FeatureType not found" };
    }
    const { action } = await import(fpath);
    const t = action as AgentTask;
    const res = await t.run(args);
    if (!quiet) {
        console.log(res.data);
    }
    await processOutput(res.data);
    return { ok: true, data: res.data, error: "" }
}

export { executeActionCmd };
