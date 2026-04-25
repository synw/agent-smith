import { parseCommandArgs } from "../utils/options_parsers.js";
import { getTaskPrompt } from "../utils/io.js";
import { executeTask } from "../tasks/cmd.js";
import type { InferenceResult } from "@agent-smith/types";

async function executeAgentCmd(
    name: string,
    targs: Array<any> = []
): Promise<InferenceResult> {
    const ca = parseCommandArgs(targs);
    const prompt = await getTaskPrompt(name, ca.args, ca.options);
    ca.options.isAgent = true;
    const res = await executeTask(name, { prompt: prompt }, ca.options)
    return res
}

export {
    executeAgentCmd,
}