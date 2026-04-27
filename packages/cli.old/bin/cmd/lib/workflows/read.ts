import { default as fs } from "fs";
import YAML from 'yaml';
import { FeatureType, WorkflowStep } from '../../../interfaces.js';
import { getFeatureSpec } from '../../../state/features.js';

async function _createWorkflowFromSpec(
    spec: Record<string, any>
): Promise<Array<WorkflowStep>> {
    const steps: Array<WorkflowStep> = [];
    //console.log("Create WF. Steps:", spec);
    for (const step of spec.steps) {
        const type = Object.keys(step)[0];
        const sval = step[type];
        const name = sval;
        const wf: WorkflowStep = {
            name: name,
            type: type == "command" ? "cmd" : type,
        };
        steps.push(wf);
    }
    //console.log("STEPS", Object.keys(steps).length, steps);
    return steps
}

async function _readWorkflowFromDisk(name: string): Promise<{ found: boolean, data: Record<string, any> }> {
    //const fp = path.join(jobsPath, `${name}.yml`);
    const { found, path } = getFeatureSpec(name, "workflow" as FeatureType);
    if (!found) {
        return { found: false, data: {} };
    }
    if (!fs.existsSync(path)) {
        return { data: {}, found: false }
    }
    const file = fs.readFileSync(path, 'utf8');
    const data = YAML.parse(file);
    data.name = name;
    return { data: data, found: true }
}

async function readWorkflow(
    name: string
): Promise<{ found: boolean, workflow: Array<WorkflowStep> }> {
    const { found, ext } = getFeatureSpec(name, "workflow" as FeatureType);
    if (!found) {
        return { found: false, workflow: [] };
    }
    let wf = new Array<WorkflowStep>();
    switch (ext) {
        case "yml":
            const { data } = await _readWorkflowFromDisk(name);
            //console.log("WF DATA", data);
            try {
                const workflow = await _createWorkflowFromSpec(data);
                //console.log("WF END", found, workflow);
                if (!found) {
                    return { found: false, workflow: [] }
                }
                wf = workflow;
            } catch (e) {
                throw new Error(`Workflow ${name} create error: ${e}`)
            }
            break
        default:
            throw new Error(`Workflow ${name} extension ${ext} not implemented`)
    }
    return { found: true, workflow: wf }
}

export {
    readWorkflow
};

