import { map } from 'nanostores';
import { AgentJob, AgentTaskSpec } from "./interfaces.js";

const useAgentJob = (name: string, title: string, tasks: Array<AgentTaskSpec>): AgentJob => {
    const _name = name;
    const _tasks: Readonly<Array<AgentTaskSpec>> = tasks;
    //console.log("INIT JOB", _tasks.map((t) => t.name));
    const state = map({
        isRunning: false,
        isCompleted: false,
        isRunningTask: false,
        runningTask: null as AgentTaskSpec | null,
    });

    const runTask = async (name: string, params?: Record<string, any>): Promise<Record<string, any>> => {
        console.log("RUN TASK", name);
        console.log("Tasks:", _tasks.map((t) => t.name));
        if (state.get().isRunningTask) {
            throw new Error('A task is already running');
        }
        const t = _tasks.find((_t) => _t.name === name);
        if (!t) {
            throw new Error(`Task ${name} not found`);
        }
        state.setKey("isRunningTask", true);
        state.setKey("runningTask", t);
        //console.log("JOB running task:", t.name);
        try {
            const res = await t.run(params ?? {});
            return res;
        } catch (error) {
            throw error;
        } finally {
            state.setKey("isRunningTask", false);
            state.setKey("runningTask", null);
        }
    };

    const abortTask = async (params: any = null) => {
        if (!state.get().isRunningTask) {
            throw new Error('No task is running, nothing to abort');
        }
        const task = state.get().runningTask;
        //console.log("ABORT", task);
        if (!task) {
            throw new Error('No running task found, can not abort');
        }
        if (!task.abort) {
            throw new Error(`Running task ${task.name} does not have an abort method`);
        }
        try {
            await task.abort(params);
        } catch (error) {
            throw error;
        } finally {
            state.setKey("isRunningTask", false);
            state.setKey("runningTask", null);
        }
    };

    const start = () => {
        state.setKey("isRunning", true);
        state.setKey("isCompleted", false);
    }

    const finish = (success: boolean) => {
        state.setKey("isRunning", false);
        state.setKey("isCompleted", success);
    }

    const getTask = (name: string): AgentTaskSpec => {
        let t = tasks.find((_t) => _t.name = name);
        if (!t) {
            throw new Error(`Task ${name} not found`)
        }
        return t
    }

    return {
        name: _name,
        title: title,
        state,
        tasks: _tasks,
        runTask,
        abortTask,
        start,
        finish,
        getTask,
    }
};

export { useAgentJob };
