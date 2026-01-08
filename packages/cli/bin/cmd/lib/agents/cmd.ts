import type { TaskOutput } from "@agent-smith/task";
import { parseCommandArgs } from "../options_parsers.js";
import { getTaskPrompt } from "../tasks/utils.js";
import { executeTask } from "../tasks/cmd.js";

async function executeAgentCmd(
    name: string,
    targs: Array<any> = []
): Promise<TaskOutput> {
    const ca = parseCommandArgs(targs);
    const prompt = await getTaskPrompt(name, ca.args, ca.options);
    ca.options.isAgent = true;
    return await executeTask(name, { prompt: prompt }, ca.options)
}

export {
    executeAgentCmd,
}