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
import { pathToFileURL } from 'url';

async function _createWorkflowFromSpec(
    spec: Record<string, any>
): Promise<Array<WorkflowStep>> {
    const steps: Array<WorkflowStep> = [];
    //console.log("Create WF. Steps:", spec);
    let i = 1;
    for (const step of spec.steps) {
        const type = Object.keys(step)[0];
        const sval = step[type];
        const name = sval;
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
                    const url = pathToFileURL(path).href;
                    const { action } = await import(url);
                    const at = action as FeatureExecutor<any, any>;
                    const wf: WorkflowStep = {
                        name: name,
                        type: "action",
                        run: at,
                    };
                    steps.push(wf);
                    break;
                case "mjs":
                    const url2 = pathToFileURL(path).href;
                    const mjsa = await import(url2);
                    const act = createJsAction(mjsa.action);
                    const wf2: WorkflowStep = {
                        name: name,
                        type: "action",
                        run: act,
                    };
                    steps.push(wf2);
                    break
                case "yml":
                    const _t1 = systemAction(path);
                    const wf3: WorkflowStep = {
                        name: name,
                        type: "action",
                        run: _t1 as FeatureExecutor<any, any>,
                    };
                    steps.push(wf3);
                    break
                case "py":
                    const _t = pythonAction(path);
                    const wf4: WorkflowStep = {
                        name: name,
                        type: "action",
                        run: _t as FeatureExecutor<any, any>,
                    };
                    steps.push(wf4);
                    break
                default:
                    throw new Error(`Unknown feature extension ${ext}`)
            }
        } else if (type == "adaptater") {
            const { found, path } = getFeatureSpec(name, "adaptater" as FeatureType);
            if (!found) {
                throw new Error(`Adaptater ${name} not found`)
            }
            const url = pathToFileURL(path).href;
            const jsa = await import(url);
            const act = createJsAction(jsa.action);
            const wf: WorkflowStep = {
                name: name,
                type: "adaptater",
                run: act,
            };
            steps.push(wf);
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
                name: name,
                type: "task",
                run: tsk.run as FeatureExecutor<any, any>,
            };
            steps.push(wf);
        }
        ++i
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

