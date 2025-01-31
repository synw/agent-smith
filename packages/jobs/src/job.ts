import { map } from 'nanostores';
import { TaskMem, TmemJobs } from "@agent-smith/tmem-jobs";
import { AgentJob, AgentJobSpec, AgentJobState, AgentTask } from "./jobsinterfaces.js";
import { useAgentTask } from './task.js';

const useAgentJob = <T = string>(initParams: AgentJobSpec<T>): AgentJob<T> => {
    const _name = initParams.name;
    let _tasks: Record<string, AgentTask<T>> = {};
    initParams.tasks.forEach((ts) => {
        const _t = useAgentTask(ts);
        _tasks[_t.id] = _t
    });
    const _title = initParams.title;
    const tmem = initParams.tmem ?? {} as TmemJobs;
    const hasTmem = initParams.tmem !== undefined;
    //console.log("INIT JOB", _tasks.map((t) => t.name));
    const state = map<AgentJobState>({
        isRunning: false,
        isCompleted: false,
        isRunningTask: false,
        runningTask: "",
    });

    const _runTask = async (t: AgentTask<T>, params: any, conf: Record<string, any>, autoComplete: boolean): Promise<Record<string, any>> => {
        /*try {
            console.log("JOB RUN TASK", t.id, autoComplete, params[0].substring(0, 100));
        } catch (e) {
            console.log("JOB RUN TASK", t.id, autoComplete, params);
        }*/
        try {
            let res: Record<string, any> = {};
            if (autoComplete) {
                res = await t.run(params, conf);
                _finishTask(t, res, true);
            } else {
                res = await t.start(params, conf);
            }
            return res;
        } catch (error) {
            _finishTask(t, {}, false);
            throw error;
        }
    };

    const _startTask = async (name: string, params: any = {}, conf: Record<string, any>, isRestart: boolean) => {
        state.setKey("isRunningTask", true);
        state.setKey("runningTask", name);
        if (hasTmem) {
            if (isRestart) {
                await tmem.reRunTask(name, params, conf);
            } else {
                await tmem.runTask(name, params, conf);
            }
        }
    }

    const _finishTask = async (task: AgentTask<T>, res: any, completed: boolean) => {
        state.setKey("isRunningTask", false);
        state.setKey("runningTask", "");
        task.finish(completed, res);
        if (hasTmem) {
            await tmem.finishTask(task.id, completed, res)
        }
    }

    const continueTask = async (params: any = {}, conf: Record<string, any> = {}): Promise<Record<string, any>> => {
        //console.log("JOB TASK CONTINUE -------- TASK PARAMS", params);
        if (!state.get().isRunningTask) {
            throw new Error('No task is running, can not continue');
        }
        const t = getTaskById(state.get().runningTask);
        return await _runTask(t, params, conf, false)
    }

    const runTask = async (name: string, params: any = {}, conf: Record<string, any> = {}): Promise<Record<string, any>> => {
        //console.log("JOB TASK RUN -------- TASK PARAMS", params);
        if (state.get().isRunningTask) {
            throw new Error('A task is already running');
        }
        await _startTask(name, params, conf, false);
        const t = getTaskById(name);
        return await _runTask(t, params, conf, true)
    }

    const startTask = async (name: string, params: any = {}, conf: Record<string, any> = {}) => {
        //console.log("JOB TASK START -------- TASK PARAMS", params);
        if (state.get().isRunningTask) {
            throw new Error('A task is already running');
        }
        await _startTask(name, params, conf, false)
    }

    const reStartTask = async (name: string, params: any = {}, conf: Record<string, any> = {}) => {
        //console.log("JOB TASK RERSTART", name);
        if (state.get().isRunningTask) {
            throw new Error('A task is already running');
        }
        await _startTask(name, params, conf, true)
    }

    const finishTask = async (completed: boolean, data?: any) => {
        //console.log("FINISH TASK", data);
        const task = getTaskById(state.get().runningTask);
        task.finish(completed, data);
        state.setKey("isRunningTask", false);
        state.setKey("runningTask", "");
        if (hasTmem) {
            await tmem.finishTask(task.id, completed, data)
        }
    }

    const abortTask = async (params: any = null) => {
        if (!state.get().isRunningTask) {
            throw new Error('No task is running, nothing to abort');
        }
        const task = getTaskById(state.get().runningTask);
        //console.log("ABORT", task);
        if (!task) {
            throw new Error('No running task found, can not abort');
        }
        if (!task.abort) {
            throw new Error(`Running task ${task.id} does not have an abort method`);
        }
        try {
            await task.abort(params);
        } catch (error) {
            throw error;
        } finally {
            state.setKey("isRunningTask", false);
            state.setKey("runningTask", "");
            if (hasTmem) {
                await tmem.finishTask(task.id, false)
            }
        }
    };

    const start = async () => {
        state.setKey("isRunning", true);
        state.setKey("isCompleted", false);
        if (hasTmem) {
            await tmem.start(_name, Object.values(_tasks))
        }
    }

    const finish = async (success: boolean) => {
        state.setKey("isRunning", false);
        state.setKey("isCompleted", success);
        if (hasTmem) {
            await tmem.finish()
        }
        /*Object.values(_tasks).forEach((t) => {
            t.state.setKey("data", {});
            t.state.setKey("isCompleted", false)
        });*/
    }

    const getTaskById = (id: string): AgentTask<T> => {
        try {
            return _tasks[id]
        } catch (e) {
            throw new Error(`Task ${id} not found`)
        }
    }


    const syncMem = async () => {
        if (hasTmem) {
            await tmem.init();
            // sync the state from the transient memory
            const isRunning = await tmem.job.get<boolean>("isRunning");
            state.setKey("isRunning", isRunning);
            //console.log("SYNCMEM job is r", isRunning);
            const runningTaskName = await tmem.job.get<string>("runningTask");
            if (runningTaskName) {
                const t = getTaskById(runningTaskName);
            }
            // tasks
            const ts = await tmem.tasks.all<TaskMem>();
            Object.values(_tasks).forEach((t) => {
                //console.log("T", t)
                const mt = ts[t.id];
                //console.log(t.id, "=>", mt)
                if (mt) {
                    t.state.setKey("isCompleted", mt.isCompleted);
                    t.state.setKey("data", mt.data);
                }
            });
            //console.log("END SYNC MEM")
        }
    }

    return {
        name: _name,
        title: _title,
        state,
        get tasks() { return _tasks },
        set tasks(t: Record<string, AgentTask<T>>) { _tasks = t },
        tmem,
        runTask,
        continueTask,
        startTask,
        reStartTask,
        finishTask,
        abortTask,
        start,
        finish,
        getTaskById,
        syncMem,
    }
};

export { useAgentJob };
