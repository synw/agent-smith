import YAML from 'yaml';
import { default as fs } from "fs";
import { AgentJob, AgentTask, useAgentJob } from "@agent-smith/jobs";
import { brain, marked, taskReader } from '../../agent.js';
import { getFeatureSpec } from '../../state/features.js';
import { FeatureType } from '../../interfaces.js';
import { formatMode } from '../../state/state.js';

async function executeJobCmd(name: string, args: Array<any> = []) {
    const { job, found } = await _dispatchReadJob(name);
    //console.log("F", found);
    if (!found) {
        console.log(`Job ${name} not found`);
        return ""
    }
    //console.log("JOB", job.tasks);
    await job.start();
    let params = args;
    let res: Record<string, any> = {};
    for (const name of Object.keys(job.tasks)) {
        //console.log("TASK RUN", name, params);
        brain.expertsForModelsInfo()
        //console.log("EFM", brain.expertsForModels);
        try {
            res = await job.runTask(name, params);
            if ("text" in res) {
                if (formatMode.value == "markdown") {
                    console.log("\n\n------------------\n");
                    console.log((marked.parse(res.text) as string).trim())
                }
            }
        }
        catch (err) {
            console.log("ERR", err);
            throw new Error(`Error executing task ${name}: ${err}`)
        }
        //console.log("RES", res);
        params = res.data;
    }
    await job.finish(true);
    //console.log("JOB RES", res)
    return res
}

async function _dispatchReadJob(name: string): Promise<{ found: boolean, job: AgentJob }> {
    const { found, path, ext } = getFeatureSpec(name, "job" as FeatureType);
    if (!found) {
        return { found: false, job: {} as AgentJob };
    }
    let jb: AgentJob;
    switch (ext) {
        case "js":
            let { job } = await import(path);
            jb = job as AgentJob;
            break;
        case "yml":
            const { data } = await readJob(name)
            const res = await _createJobFromSpec(data);
            jb = res.job;
            break
        default:
            throw new Error(`Job extension ${ext} not implemented`)
            break;
    }
    return { found: true, job: jb }
}

async function _createJobFromSpec(spec: Record<string, any>): Promise<{ found: boolean, job: AgentJob }> {
    const job = useAgentJob({
        name: spec.name,
        title: spec.title,
        tasks: []
    });
    const tasks: Record<string, AgentTask> = {};
    //console.log("Create job. Feats:", feats);
    for (const t of spec.tasks) {
        if (t.type == "action") {
            const { found, path } = getFeatureSpec(t.name, "action" as FeatureType);
            if (!found) {
                return { found: false, job: {} as AgentJob };
            }
            const { action } = await import(path);
            tasks[t.name] = action;
        } else {
            const { found, path } = getFeatureSpec(t.name, "task" as FeatureType);
            if (!found) {
                return { found: false, job: {} as AgentJob };
            }
            const at = taskReader.init(path);
            tasks[t.name] = at
        }
    }
    job.tasks = tasks;
    return { job: job, found: true }
}

async function readJob(name: string): Promise<{ found: boolean, data: Record<string, any> }> {
    //const fp = path.join(jobsPath, `${name}.yml`);
    const { found, path, ext } = getFeatureSpec(name, "job" as FeatureType);
    if (!found) {
        return { found: false, data: {} };
    }
    if (!fs.existsSync(path)) {
        return { data: {} as AgentJob, found: false }
    }
    const file = fs.readFileSync(path, 'utf8');
    const data = YAML.parse(file);
    data.name = name;
    return { data: data, found: true }
}

export { readJob, executeJobCmd }