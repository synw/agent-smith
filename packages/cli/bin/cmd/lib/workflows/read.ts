import { Agent } from '@agent-smith/agent';
import { Task } from '@agent-smith/task';
import { default as fs } from "fs";
import YAML from 'yaml';
import { FeatureExecutor, FeatureType, WorkflowStep } from '../../../interfaces.js';
import { backend } from '../../../state/backends.js';
import { getFeatureSpec } from '../../../state/features.js';
import { readTask } from "../../sys/read_task.js";
import { pythonAction, systemAction } from '../actions/cmd.js';
import { createJsAction } from '../actions/read.js';

async function _createWorkflowFromSpec(
    spec: Record<string, any>
): Promise<Record<string, WorkflowStep>> {
    const steps: Record<string, WorkflowStep> = {};
    //console.log("Create job. Feats:", spec);
    for (const step of spec.steps) {
        const type = Object.keys(step)[0];
        const sval = step[type];
        let name: string;
        if (typeof sval == "string") {
            name = sval
        } else {
            name = step[type].name;
        }
        //console.log("WF", type, name);
        //const params = step?.params;
        //console.log("TASK SPEC", t);
        if (type == "action") {
            const { found, path, ext } = getFeatureSpec(name, "action" as FeatureType);
            if (!found) {
                throw new Error(`Action ${name} not found`)
            }
            switch (ext) {
                case "js":
                    const { action } = await import(path);
                    const at = action as FeatureExecutor<any, any>;
                    const wf: WorkflowStep = {
                        type: "action",
                        run: at,
                    };
                    steps[name] = wf;
                    break;
                case "mjs":
                    const mjsa = await import(path);
                    const act = createJsAction(mjsa.action);
                    const wf2: WorkflowStep = {
                        type: "action",
                        run: act,
                    };
                    steps[name] = wf2;
                    break
                case "yml":
                    const _t1 = systemAction(path);
                    const wf3: WorkflowStep = {
                        type: "action",
                        run: _t1 as FeatureExecutor<any, any>,
                    };
                    steps[name] = wf3;
                    break
                case "py":
                    const _t = pythonAction(path);
                    const wf4: WorkflowStep = {
                        type: "action",
                        run: _t as FeatureExecutor<any, any>,
                    };
                    steps[name] = wf4;
                    break
                default:
                    throw new Error(`Unknown feature extension ${ext}`)
            }
        } else if (type == "adaptater") {
            const { found, path } = getFeatureSpec(name, "adaptater" as FeatureType);
            if (!found) {
                throw new Error(`Adaptater ${name} not found`)
            }
            const jsa = await import(path);
            const act = createJsAction(jsa.action);
            const wf: WorkflowStep = {
                type: "adaptater",
                run: act,
            };
            steps[name] = wf;
        }
        else {
            const { found, path } = getFeatureSpec(name, "task" as FeatureType);
            if (!found) {
                throw new Error(`Task ${name} not found`)
            }
            const res = readTask(path);
            if (!res.found) {
                throw new Error(`Unable to read task ${name} ${path}`)
            }
            const agent = new Agent(backend.value!);
            const tsk = Task.fromYaml(agent, res.ymlTask);
            const wf: WorkflowStep = {
                type: "task",
                run: tsk.run as FeatureExecutor<any, any>,
            };
            steps[name] = wf;
        }
    }
    //console.log("WFNT", Object.keys(steps).length);
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
): Promise<{ found: boolean, workflow: Record<string, WorkflowStep> }> {
    const { found, ext } = getFeatureSpec(name, "workflow" as FeatureType);
    if (!found) {
        return { found: false, workflow: {} };
    }
    let wf: Record<string, WorkflowStep> = {};
    switch (ext) {
        case "yml":
            const { data } = await _readWorkflowFromDisk(name);
            //console.log("WF DATA", data);
            try {
                const workflow = await _createWorkflowFromSpec(data);
                //console.log("WF END", found, workflow);
                if (!found) {
                    return { found: false, workflow: {} }
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

