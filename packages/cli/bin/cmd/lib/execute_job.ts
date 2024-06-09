import YAML from 'yaml';
import { default as fs } from "fs";
import { AgentJob, AgentTask, useAgentJob } from "@agent-smith/jobs";
import { brain, taskReader } from '../../agent.js';
import { getFeatureSpec } from '../../state/features.js';
import { FeatureType } from '../../interfaces.js';

async function _createJob(name: string): Promise<{ found: boolean, job: AgentJob }> {
    const { data, found } = await readJob(name);
    if (!found) {
        throw new Error(`Job ${name} not found`)
    }
    const job = useAgentJob({
        name: name,
        title: data.title,
        tasks: []
    });
    const tasks: Record<string, AgentTask> = {};
    //console.log("Create job. Feats:", feats);
    for (const t of data.tasks) {
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
            const at = taskReader.read(path);
            tasks[t.name] = at
        }
    }
    job.tasks = tasks;
    return { job: job, found: true }
}

async function executeJobCmd(name: string, args: Array<any> = []) {
    const { job, found } = await _createJob(name);
    //console.log("JOB", job);
    await job.start();
    let params = args;
    let res: Record<string, any> = {};
    for (const name of Object.keys(job.tasks)) {
        //console.log("TASK RUN", name, params?.length);
        brain.expertsForModelsInfo()
        //console.log("EFM", brain.expertsForModels);
        res = await job.runTask(name, params);
        //console.log("RES", res);
        params = res.data;
    }
    await job.finish(true);
    return res
}

async function readJob(name: string): Promise<{ found: boolean, data: Record<string, any> }> {
    //const fp = path.join(jobsPath, `${name}.yml`);
    const { found, path } = getFeatureSpec(name, "job" as FeatureType);
    if (!found) {
        return { found: false, data: {} };
    }
    if (!fs.existsSync(path)) {
        return { data: {} as AgentJob, found: false }
    }
    const file = fs.readFileSync(path, 'utf8');
    const data = YAML.parse(file);
    return { data: data, found: true }
}

export { readJob, executeJobCmd }