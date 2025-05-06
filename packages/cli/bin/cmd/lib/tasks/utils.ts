import YAML from 'yaml';
import { readTask } from "../../../cmd/sys/read_task.js";
import { getFeatureSpec } from "../../../state/features.js";
import { FeatureType, LmTaskFileSpec } from "../../../interfaces.js";

function openTaskSpec(name: string) {
    const { found, path } = getFeatureSpec(name, "task" as FeatureType);
    if (!found) {
        throw new Error(`Task ${name} not found`);
    }
    //console.log("EFM", brain.expertsForModels);    
    const res = readTask(path);
    if (!res.found) {
        throw new Error(`Task ${name}, ${path} not found`)
    }
    //const taskRawSpec = taskBuilder.readFromYaml(res.ymlTask);
    const taskFileSpec = YAML.parse(res.ymlTask) as LmTaskFileSpec;
    return taskFileSpec
}

export {
    openTaskSpec,
}