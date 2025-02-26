import YAML from 'yaml';
import { default as fs } from "fs";
import { AgentJob, AgentTask, useAgentJob } from "@agent-smith/jobs";
//import { AgentJob, AgentTask, useAgentJob } from "../../../../jobs/dist/main.js";
import { brain, marked, taskBuilder } from '../../agent.js';
import { getFeatureSpec } from '../../state/features.js';
import { FeatureType } from '../../interfaces.js';
import { formatMode, isDebug, isVerbose } from '../../state/state.js';
import { initTaskConf, initTaskParams, initTaskVars, readTask } from './utils.js';
import { pythonAction, systemAction } from './execute_action.js';

async function executeJobCmd(name: string, args: Array<any> = [], options: any = {}): Promise<Record<string, any>> {
    const { job, found } = await _dispatchReadJob(name);
    if (isDebug.value || isVerbose.value) {
        console.log("Running job", name, Object.keys(job.tasks).length, "tasks");
    }
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
    const finalTaskIndex = Object.keys(job.tasks).length - 1;
    for (const [name, task] of Object.entries(job.tasks)) {
        //console.log("JOB TASK", name, task.type, "/", args, "/", options);
        if (task.type == "task") {
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
            //console.log("Task spec", taskSpec);
            let conf: Record<string, any> = {};
            let vars: Record<string, any> = {};
            if (i == 0) {
                const vs = initTaskVars(args, taskSpec?.inferParams ? taskSpec.inferParams as Record<string, any> : {});
                conf = vs.conf;
                vars = vs.vars;
            } else {
                const vs = initTaskParams(params, taskSpec?.inferParams ? taskSpec.inferParams as Record<string, any> : {});
                conf = vs.conf;
                vars = vs.vars;
            }
            //conf = tv.conf;
            //vars = i == 0 ? tv.vars : params;
            conf = initTaskConf(conf, taskSpec);
            if (isDebug.value) {
                console.log("Task conf:", conf);
                console.log("Task vars:", vars);
            }
            if (isVerbose.value || isDebug.value) {
                conf.verbose = true;
            }
            //console.log("CONF", conf);
            const ex = brain.getOrCreateExpertForModel(conf.model.name, conf.model.template);
            //console.log("EFM", ex?.name);
            if (!ex) {
                throw new Error("No expert found for model " + conf.model.name)
            }
            ex.checkStatus();
            ex.backend.setOnToken((t) => {
                process.stdout.write(t)
            });
            conf["expert"] = ex;
            try {
                if (isDebug.value || isVerbose.value) {
                    console.log(i + 1, "Running task", name);
                    console.log("IP", conf.inferParams.images.length);
                }
                try {
                    //console.log("PPP", { ...params, ...vars });
                    res = await job.runTask(name, { ...params, ...vars }, conf);
                } catch (e) {
                    throw new Error(`Error running job task ${e}`)
                }
                //console.log("RES", res);
                if (res?.error) {
                    return { ok: false, data: "", conf: conf, error: `Error executing job task ${name}: ${res.error}` }
                }
                if ("text" in res) {
                    if (formatMode.value == "markdown") {
                        console.log("\n\n------------------\n");
                        console.log((marked.parse(res.text) as string).trim())
                    }
                }
                params = res
            }
            catch (err) {
                return { error: `Error executing job task ${name}: ${err}` }
            }
        } else {
            try {
                if (isDebug.value) {
                    console.log(i + 1, "Running action", name, args);
                } else if (isVerbose.value) {
                    console.log(i + 1, "Running action", name);
                }
                const _p = i == 0 ? args : params;
                try {
                    res = await job.runTask(name, _p, options);
                } catch (e) {
                    throw new Error(`Error executing job action ${e}`)
                }
                //console.log("RES", res);
                if (res?.error) {
                    return { ok: false, data: "", conf: {}, error: `Error executing action ${name}: ${res.error}` }
                }
                //console.log(i, "/", finalTaskIndex, i == finalTaskIndex)
                if (i == finalTaskIndex) {
                    // it is the last action, output the final result
                    console.log(res.data);
                } else {
                    params = res.data;
                }
                params = res.data;
                //console.log("Params", params)
            }
            catch (err) {
                return { error: `Error executing (${task.type}) task ${name}: ${err}` }
            }
        }
        ++i
    }
    await job.finish(true);
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
            const { found, path, ext } = getFeatureSpec(t.name, "action" as FeatureType);
            if (!found) {
                return { found: false, job: {} as AgentJob<FeatureType> };
            }
            if (ext == "js") {
                const { action } = await import(path);
                const at = action as AgentTask<FeatureType>;
                at.type = "action";
                tasks[t.name] = at;
            } else if (ext == "yml") {
                const _t = systemAction(path);
                _t.type = "action";
                tasks[t.name] = _t;
            } else if (ext == "py") {
                const _t = pythonAction(path);
                _t.type = "action";
                tasks[t.name] = _t;
            }
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