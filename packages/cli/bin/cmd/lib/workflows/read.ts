import YAML from 'yaml';
import { default as fs } from "fs";
import { AgentTask } from "@agent-smith/jobs";
import { taskBuilder } from '../../../agent.js';
import { getFeatureSpec } from '../../../state/features.js';
import { FeatureType, NodeReturnType } from '../../../interfaces.js';
import { createJsAction, readTask } from '../utils.js';
import { pythonAction, systemAction } from './../execute_action.js';

async function _createWorkflowFromSpec(
    spec: Record<string, any>
): Promise<Record<string, AgentTask<FeatureType, any, NodeReturnType<any>, Record<string, any>>>> {
    const steps: Record<string, AgentTask<FeatureType, any, NodeReturnType<any>, Record<string, any>>> = {};
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
                    const at = action as AgentTask<FeatureType, any, NodeReturnType<any>>;
                    at.type = "action";
                    steps[name] = at;
                    break;
                case "mjs":
                    const mjsa = await import(path);
                    const act = createJsAction(mjsa.action);
                    act.type = "action";
                    steps[name] = act;
                    break
                case "yml":
                    const _t1 = systemAction(path);
                    _t1.type = "action";
                    steps[name] = _t1;
                    break
                case "py":
                    const _t = pythonAction(path);
                    _t.type = "action";
                    steps[name] = _t;
                    break
                default:
                    throw new Error(`Unknown feature extension ${ext}`)
            }
        } else {
            const { found, path } = getFeatureSpec(name, "task" as FeatureType);
            if (!found) {
                throw new Error(`Task ${name} not found`)
            }
            const res = readTask(path);
            if (!res.found) {
                throw new Error(`Unable to read task ${name} ${path}`)
            }
            const tsk = taskBuilder.fromYaml(res.ymlTask, "task");
            /*if (t?.chain) {
                tsk.properties = { "chain": true };
            }*/
            steps[name] = tsk as unknown as AgentTask<FeatureType, any, NodeReturnType<any>, Record<string, any>>;
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
): Promise<{ found: boolean, workflow: Record<string, AgentTask<FeatureType, any, NodeReturnType<any>, Record<string, any>>> }> {
    const { found, ext } = getFeatureSpec(name, "workflow" as FeatureType);
    if (!found) {
        return { found: false, workflow: {} };
    }
    let wf: Record<string, AgentTask<FeatureType, any, NodeReturnType<any>, Record<string, any>>> = {};
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
                throw new Error(`Workflow create error: ${e}`)
            }
            break
        default:
            throw new Error(`Workflow extension ${ext} not implemented`)
    }
    return { found: true, workflow: wf }
}

export {
    readWorkflow,
}

