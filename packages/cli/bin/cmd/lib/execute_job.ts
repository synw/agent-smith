import YAML from 'yaml';
import { default as fs } from "fs";
import { AgentJob, AgentTask, useAgentJob } from "@agent-smith/jobs";
//import { AgentJob, AgentTask, useAgentJob } from "../../../../jobs/src/main";
import { brain, marked, taskBuilder } from '../../agent.js';
import { getFeatureSpec } from '../../state/features.js';
import { FeatureType } from '../../interfaces.js';
import { formatMode } from '../../state/state.js';
import { initTaskVars, readTask } from './utils.js';

async function executeJobCmd(name: string, args: Array<any> = [], options: any = {}): Promise<Record<string, any>> {
    const { job, found } = await _dispatchReadJob(name);
    //console.log("F", found);
    if (!found) {
        console.log(`Job ${name} not found`);
        return { error: `Job ${name} not found` }
    }
    //console.log("JOB", job.tasks);
    await job.start();
    let res: Record<string, any> = {};
    let params: Record<string, any> = {};
    brain.backendsForModelsInfo();
    let i = 0;
    for (const [name, task] of Object.entries(job.tasks)) {
        //console.log("JOB TASK", name, task.type, "/", args, "/", options);
        if (task.type == "task") {
            //const pr = params.shift()!;
            let conf: Record<string, any> = {};
            let vars: Record<string, any> = {};
            const tv = initTaskVars(args);
            //console.log("TV", tv);
            conf = tv.conf;
            vars = i == 0 ? tv.vars : params;
            /*if (i == 0) {
                const tv = initTaskVars(args);
                console.log("TV", tv);
                conf = tv.conf;
                vars = tv.vars;
            } else {
                conf = {};
                vars = params;
            }*/
            const { found, path } = getFeatureSpec(name, "task" as FeatureType);
            if (!found) {
                return { ok: false, data: {}, error: `Task ${name} not found` };
            }
            //console.log("TASK PATH", path, found);
            const tres = readTask(path);
            if (!tres.found) {
                throw new Error(`Task ${name}, ${path} not found`)
            }
            const taskSpec = taskBuilder.readFromYaml(tres.ymlTask);
            //const task = taskBuilder.fromYaml(tres.ymlTask);
            let m = taskSpec.model.name;
            let t = taskSpec.model.template;
            if (conf?.model) {
                m = conf.model
            }
            if (conf?.template) {
                t = conf.template
            }
            //console.log("CONF", conf);
            const ex = brain.getOrCreateExpertForModel(m, t);
            //console.log("EFM", ex?.name);
            if (!ex) {
                throw new Error("No expert found for model " + m)
            }
            ex.checkStatus();
            ex.backend.setOnToken((t) => {
                process.stdout.write(t)
            });
            conf["expert"] = ex;
            try {
                //console.log("Running", name, vars, "/", conf);
                res = await job.runTask(name, vars, conf);
                if ("text" in res) {
                    if (formatMode.value == "markdown") {
                        console.log("\n\n------------------\n");
                        console.log((marked.parse(res.text) as string).trim())
                    }
                }
                params = res
            }
            catch (err) {
                return { error: `Error executing (${task.type}) task ${name}: ${err}` }
            }
        } else {
            try {
                if (i == 0) {
                    //console.log("Running", name, args);
                    res = await job.runTask(name, args, options);
                } else {
                    //console.log("Running", name, params);
                    res = await job.runTask(name, params, options);
                }
                //console.log("RES", res.data);
                params = res.data;
            }
            catch (err) {
                return { error: `Error executing (${task.type}) task ${name}: ${err}` }
            }
        }
        ++i
    }
    await job.finish(true);
    //console.log("JOB RES", res)
    return res
}

async function _dispatchReadJob(name: string): Promise<{ found: boolean, job: AgentJob<FeatureType> }> {
    const { found, path, ext } = getFeatureSpec(name, "job" as FeatureType);
    if (!found) {
        return { found: false, job: {} as AgentJob<FeatureType> };
    }
    let jb: AgentJob<FeatureType>;
    switch (ext) {
        case "js":
            let { job } = await import(path);
            jb = job as AgentJob<FeatureType>;
            break;
        case "yml":
            const { data } = await readJob(name)
            const res = await _createJobFromSpec(data);
            jb = res.job;
            break
        default:
            throw new Error(`Job extension ${ext} not implemented`)
    }
    return { found: true, job: jb }
}

async function _createJobFromSpec(spec: Record<string, any>): Promise<{ found: boolean, job: AgentJob<FeatureType> }> {
    const job = useAgentJob<FeatureType>({
        name: spec.name,
        title: spec.title,
        tasks: []
    });
    const tasks: Record<string, AgentTask<FeatureType>> = {};
    //console.log("Create job. Feats:", feats);
    for (const t of spec.tasks) {
        //console.log("TASK SPEC", t);
        if (t.type == "action") {
            const { found, path } = getFeatureSpec(t.name, "action" as FeatureType);
            if (!found) {
                return { found: false, job: {} as AgentJob<FeatureType> };
            }
            const { action } = await import(path);
            const at = action as AgentTask<FeatureType>;
            at.type = "action";
            tasks[t.name] = at;
        } else {
            const { found, path } = getFeatureSpec(t.name, "task" as FeatureType);
            if (!found) {
                return { found: false, job: {} as AgentJob<FeatureType> };
            }
            const res = readTask(path);
            if (!res.found) {
                throw new Error(`Task ${t.name}, ${path} not found`)
            }
            const at = taskBuilder.fromYaml(res.ymlTask);
            at.type = "task";
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