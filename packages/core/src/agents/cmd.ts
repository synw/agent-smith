import { getTaskPrompt } from "../utils/io.js";
import { executeTask } from "../tasks/cmd.js";
import type { InferenceResult } from "@agent-smith/types";

async function executeAgent(
    name: string,
    args: any,
    options: Record<string, any>
): Promise<InferenceResult> {
    const prompt = await getTaskPrompt(name, args, options);
    options.isAgent = true;
    const res = await executeTask(name, { prompt: prompt }, options)
    return res
}

export {
    executeAgent,
}