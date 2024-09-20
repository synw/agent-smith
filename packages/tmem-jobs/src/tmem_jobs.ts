import { useTmem } from "@agent-smith/tmem";
import { JobMem, TaskMem, TmemJobs } from "./tmemjobsinterfaces.js";

const useTmemJobs = (isVerbose = false): TmemJobs => {
    const jMem = useTmem<JobMem>("job", {
        runningTask: "",
        isRunning: false,
        runningJob: "",
    }, isVerbose);
    const tMem = useTmem<Record<string, TaskMem>>("tasks", {}, isVerbose);

    const init = async () => {
        await jMem.init();
        await tMem.init();
    }

    const start = async (name: string, tasks: Array<Record<string, any>>) => {
        await jMem.set("isRunning", true);
        await jMem.set("runningJob", name);
        await jMem.set("runningTask", name);
        // load the job's tasks in the db
        //if ((await tMem.keys()).length == 0)
        await tMem.db.clear();
        tasks.forEach(async (t) => await tMem.set(t.id, {
            isCompleted: false,
            params: {},
            conf: {},
            data: {},
        }))
    }

    const finish = async () => {
        await jMem.set("isRunning", false);
    }

    const _runTask = async (id: string, params: any, isRestart: boolean, conf: Record<string, any> = {}) => {
        //console.log("TMEM run task", id, params);
        const t = await tMem.get<TaskMem>(id);
        // update the job state
        await jMem.set("runningTask", id);
        // update tasks params
        if (!isRestart) {
            // keep the params for a restart
            t.params = params;
            t.conf = conf;
        }
        t.data = {};
        //console.log("MEM RUN T", id, t.params);
        await tMem.set(id, t);
        //const res = await tMem.get(id);
        //console.log("RES", JSON.stringify(res, null, "  "))
    }

    const runTask = async (id: string, params: any, conf: Record<string, any> = {}) => {
        return await _runTask(id, params, false, conf)
    }

    const reRunTask = async (id: string, params: any, conf: Record<string, any> = {}) => {
        return await _runTask(id, params, true, conf)
    }

    const finishTask = async (id: string, completed: boolean, data?: any) => {
        const t = await tMem.get<TaskMem>(id);
        // update the job state
        //await jMem.set("task", "");
        if (completed) {
            await jMem.set("runningTask", "");
        }
        // update the task state
        t.isCompleted = completed;
        if (data) {
            t.data = data
        }
        //console.log("MEM FINISH T", id, t, "/", data);
        await tMem.set(id, t);
    }

    return {
        tasks: tMem,
        job: jMem,
        init,
        start,
        finish,
        runTask,
        reRunTask,
        finishTask,
    }
}

export { useTmemJobs }