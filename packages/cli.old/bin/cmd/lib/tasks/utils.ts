import YAML from 'yaml';
import { readClipboard } from '../../../cmd/sys/clipboard.js';
import { readTask } from "../../../cmd/sys/read_task.js";
import { FeatureType, LmTaskFileSpec } from "../../../interfaces.js";
import { getFeatureSpec } from "../../../state/features.js";
import { runtimeDataError } from '../user_msgs.js';
import { readPromptFile } from '../utils.js';

function openTaskSpec(name: string, isAgent = false): { taskFileSpec: LmTaskFileSpec, taskPath: string } {
    const ft = isAgent ? "agent" : "task";
    const { found, path } = getFeatureSpec(name, ft as FeatureType);
    if (!found) {
        throw new Error(`${ft} ${name} not found`);
    }
    const res = readTask(path);
    if (!res.found) {
        throw new Error(`${ft} ${name}, ${path} not found`)
    }
    const taskFileSpec = YAML.parse(res.ymlTask);
    taskFileSpec.name = name;
    return { taskFileSpec: taskFileSpec as LmTaskFileSpec, taskPath: path }
}

async function getInputFromOptions(
    options: Record<string, any>,
): Promise<string | null> {
    let out: string | null = null;
    if (options?.clipboardInput === true) {
        out = await readClipboard();
        options.clipboardInput = false;
    } else if (options?.inputFile === true) {
        out = readPromptFile();
        options.inputFile = false;
    }
    return out
}

async function getTaskPrompt(
    name: string,
    args: Array<string>,
    options: Record<string, any>,
): Promise<string> {
    const ic = await getInputFromOptions(options);
    if (ic) {
        return ic
    }
    let pr: string;
    if (args[0] !== undefined) {
        pr = args[0]
    }
    else {
        runtimeDataError(options?.isAgent ? "agent" : "task", name, "provide a prompt or use input options")
        throw new Error()
    }
    return pr
}

export {
    getTaskPrompt,
    getInputFromOptions,
    openTaskSpec,
};
