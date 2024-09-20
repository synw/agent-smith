import { map } from 'nanostores';
import { AgentTask, AgentTaskState, type AgentTaskSpec } from "./jobsinterfaces.js";

const useAgentTask = <T = string>(spec: AgentTaskSpec<T>): AgentTask<T> => {
    //console.log("Init task:", JSON.stringify(spec, null, "  "));
    const id = spec.id;
    const title = spec.title ?? "";
    const description = spec.description ?? "";
    const type: T = spec.type ?? "" as T;
    const runFunc = spec.run;
    const abortFunc = spec.abort;
    //const actions = spec.actions;
    const state = map<AgentTaskState>({
        isRunning: false,
        isCompleted: false,
        data: null,
    });

    const _run = async (params: any, conf: Record<string, any>, autoComplete: boolean): Promise<Record<string, any>> => {
        //console.log("TASK run task", id, autoComplete, params);
        state.setKey("isRunning", true);
        state.setKey("data", null);
        let data: Record<string, any> = {};
        if (runFunc) {
            const d = await runFunc(params, conf);
            data = d;
        }
        if (autoComplete) {
            finish(true, data)
        }
        return data
    }

    const run = async (params: any, conf: Record<string, any> = {}): Promise<Record<string, any>> => {
        return _run(params, conf, true)
    }

    const start = async (params: any, conf: Record<string, any> = {}): Promise<Record<string, any>> => {
        return _run(params, conf, false)
    }

    const finish = (completed: boolean, data?: any): void => {
        //console.log("TASK finish task", id, completed, data);
        state.setKey("isRunning", false);
        state.setKey("isCompleted", completed);
        if (data) {
            state.setKey("data", data)
        }
    }

    const abort = async (params: any = null) => {
        if (!abortFunc) {
            console.warn(`The task ${id} has no abort method`)
            return
        }
        if (!state.get().isRunning) {
            throw new Error("Nothing to abort, no task is running")
        }
        await abortFunc(params);
        state.setKey("isRunning", false);
        state.setKey("isCompleted", false);
        state.setKey("data", null);
    }

    return {
        id,
        title,
        description,
        type,
        state,
        run,
        abort,
        start,
        finish,
    }
};

export { useAgentTask }