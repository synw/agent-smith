import YAML from 'yaml';
import { default as fs } from "fs";
import { AgentJob, AgentTask, useAgentJob } from "@agent-smith/jobs";
//import { AgentJob, AgentTask, useAgentJob } from "../../../../jobs/dist/main.js";
import { brain, marked, taskBuilder } from '../../agent.js';
import { getFeatureSpec } from '../../state/features.js';
import { FeatureType, NodeReturnType } from '../../interfaces.js';
import { formatMode, isDebug, isVerbose } from '../../state/state.js';
import { createJsAction, initActionVars, initTaskConf, initTaskParams, initTaskVars, parseInputOptions, readTask } from './utils.js';
import { pythonAction, systemAction } from './execute_action.js';
import { TurnBlock } from 'modprompt/dist/interfaces.js';

async function executeJobCmd(name: string, args: Array<any> = [], options: any = {}): Promise<Record<string, any>> {
    const { job, found } = await _dispatchReadJob(name);
    if (isDebug.value || isVerbose.value) {
        console.log("Running job", name, Object.keys(job.tasks).length, "tasks");
    }
    if (!found) {
        throw new Error(`Job ${name} not found`)
    }
    await job.start();
    let res: Record<string, any> = {};
    let params: Record<string, any> = {};
    brain.backendsForModelsInfo();
    let i = 0;
    const finalTaskIndex = Object.keys(job.tasks).length - 1;
    for (const [name, task] of Object.entries(job.tasks)) {
        //console.log("JOB TASK", name, task.type, "/", args, "/", options);
        if (task.type == "task") {
            const chain = task.properties?.chain;
            const { found, path } = getFeatureSpec(name, "task" as FeatureType);
            if (!found) {
                throw new Error(`Task ${name} not found`);
            }
            const tres = readTask(path);
            if (!tres.found) {
                throw new Error(`Task ${name}, ${path} not found`)
            }
            const taskSpec = taskBuilder.readFromYaml(tres.ymlTask);
            if (params.data?.history?.length > 0) {
                const taskShots = taskSpec?.shots ?? [];
                taskSpec.shots = [...taskShots, ...params.data.history]
            }
            //console.log("Task spec", taskSpec);
            let conf: Record<string, any> = {};
            let vars: Record<string, any> = {};
            if (i == 0) {
                const vs = initTaskVars(args, taskSpec?.inferParams ? taskSpec.inferParams as Record<string, any> : {});
                conf = vs.conf;
                vars = vs.vars;
                const _pr = await parseInputOptions(options);
                if (_pr) {
                    vars.prompt = _pr
                }
                //console.log("TV", vars);
            } else {
                if (!params?.prompt) {
                    // try to get the prompt from the last generation
                    if (params?.text) {
                        params.prompt = params.text;
                    } else {
                        throw new Error(`No prompt provided for task ${name}.\Params: ${JSON.stringify(params, null, 2)}`)
                    }
                }
                const vs = initTaskParams(params, taskSpec?.inferParams ? taskSpec.inferParams as Record<string, any> : {});
                conf = vs.conf;
                vars = vs.vars;
            }
            const nextParams: Record<string, any> = {};
            // filter vars
            for (const [k, v] of Object.entries(vars)) {
                if (taskSpec.variables?.required?.includes(k) || taskSpec.variables?.optional?.includes(k) || k == "prompt") {
                    continue
                };
                nextParams[k] = v;
                delete vars[k]
            }
            conf = initTaskConf(conf, taskSpec);
            if (isDebug.value) {
                console.log("Task conf:", conf);
                console.log("Task vars:", vars);
                console.log("Next params:", nextParams);
            }
            if (isVerbose.value || isDebug.value) {
                conf.verbose = true;
            }
            const ex = brain.getOrCreateExpertForModel(conf.model.name, conf.model.template);
            //console.log("EFM", ex?.name);
            if (!ex) {
                throw new Error("No expert found for model " + conf.model.name)
            }
            ex.checkStatus();
            ex.backend.setOnToken((t) => {
                process.stdout.write(t)
            });
            brain.setDefaultExpert(ex);
            conf["expert"] = ex;
            try {
                if (isDebug.value || isVerbose.value) {
                    console.log(i + 1, "Running task", name);
                }
                try {
                    //console.log("INVARS", { ...params, ...vars });
                    const invars = { ...params, ...vars };
                    try {
                        res = await job.runTask(name, invars, conf);
                        console.log("");
                    } catch (e) {
                        throw new Error(`Error running task ${name}: ${e}`)
                    }
                    if (chain) {
                        //console.log("PR", vars.prompt);
                        const turn: TurnBlock = {
                            user: vars["prompt"],
                            assistant: res.text
                        }
                        if (res.data?.history) {
                            res.data.history.push(turn);
                        } else {
                            res.data.history = [turn]
                        }
                    } else {
                        if (res.data?.history) {
                            res.data.history = [];
                        }
                    }
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
                params = { ...res, ...nextParams }
            }
            catch (err) {
                return { error: `Error executing job task ${name}: ${err}` }
            }
        } else {
            try {
                const _p = i == 0 ? args : params;
                let nextParams = {};
                if (i == 0) {
                    const { vars } = initActionVars(args);
                    nextParams = vars;
                    //console.log("NVARS", nextParams);
                    //console.log("ARGS0", args);
                }
                if (isDebug.value) {
                    console.log(i + 1, "Running action", name, _p);
                } else if (isVerbose.value) {
                    console.log(i + 1, "Running action", name);
                }
                try {
                    res = await job.runTask(name, _p, options);
                    //console.log("JRES", res);
                    if (res?.error) {
                        throw new Error(`Error executing job action ${res.error}`)
                    }
                } catch (e) {
                    throw new Error(`Error executing job action ${e}`)
                }
                //console.log("RES", res);
                if (!res.ok) {
                    return { ok: false, data: "", conf: {}, error: `Error executing action ${name}: ${res?.error}` }
                }
                if (i == finalTaskIndex) {
                    // it is the last action, output the final result
                    console.log(res.data);
                } else {
                    params = res.data;
                }
                params = { ...res.data, ...nextParams };
                //console.log("Params", params)
            }
            catch (err) {
                throw new Error(`Error executing (${task.type}) task ${name}: ${err}`)
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
            const { data } = await readJob(name);
            //console.log("JOB DATA", data);
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
    const tasks: Record<string, AgentTask<FeatureType, any, NodeReturnType<any>, Record<string, any>>> = {};
    //console.log("Create job. Feats:", spec);
    for (const t of spec.tasks) {
        //console.log("TASK SPEC", t);
        if (t.type == "action") {
            const { found, path, ext } = getFeatureSpec(t.name, "action" as FeatureType);
            if (!found) {
                return { found: false, job: {} as AgentJob<FeatureType> };
            }
            if (ext == "js") {
                const { action } = await import(path);
                const at = action as AgentTask<FeatureType, any, NodeReturnType<any>>;
                at.type = "action";
                tasks[t.name] = at;
            } else if (ext == "mjs") {
                const mjsa = await import(path);
                const act = createJsAction(mjsa.action);
                act.type = "action";
                tasks[t.name] = act;
            }
            else if (ext == "yml") {
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
            const at = taskBuilder.fromYaml(res.ymlTask, "task");
            if (t?.chain) {
                at.properties = { "chain": true };
            }
            const tsk = at;

            //@ts-ignore
            tasks[t.name] = tsk;
        }
    }
    // @ts-ignore
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