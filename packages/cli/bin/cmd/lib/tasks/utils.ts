import YAML from 'yaml';
import { readClipboard } from '../../../cmd/sys/clipboard.js';
import { readTask } from "../../../cmd/sys/read_task.js";
import { FeatureType, LmTaskFileSpec } from "../../../interfaces.js";
import { getFeatureSpec } from "../../../state/features.js";
import { runtimeDataError } from '../user_msgs.js';
import { readPromptFile } from '../utils.js';

function openTaskSpec(name: string): { taskFileSpec: LmTaskFileSpec, taskPath: string } {
    const { found, path } = getFeatureSpec(name, "task" as FeatureType);
    if (!found) {
        throw new Error(`Task ${name} not found`);
    }
    const res = readTask(path);
    if (!res.found) {
        throw new Error(`Task ${name}, ${path} not found`)
    }
    const taskFileSpec = YAML.parse(res.ymlTask);
    taskFileSpec.name = name;
    return { taskFileSpec: taskFileSpec as LmTaskFileSpec, taskPath: path }
}

async function getTaskPrompt(
    name: string,
    args: Array<string>,
    options: Record<string, any>,
): Promise<string> {

    let pr: string;
    //console.log("TOPT", options);
    if (options?.clipboardInput === true) {
        pr = await readClipboard()
    } else if (options?.inputFile === true) {
        pr = readPromptFile()
    } else {
        if (args[0] !== undefined) {
            pr = args[0]
        }
        else {
            runtimeDataError("task", name, "provide a prompt or use input options")
            throw new Error()
        }
    }
    return pr
}

export {
    getTaskPrompt, openTaskSpec
};
