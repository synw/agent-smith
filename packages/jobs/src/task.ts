import { map } from 'nanostores';
import { AgentTask, AgentTaskState, type AgentTaskSpec } from "./interfaces.js";

const useAgentTask = <T = string, I = any, O = Record<string, any>, P extends Record<string, any> = Record<string, any>>(
    spec: AgentTaskSpec<T, I, O, P>
): AgentTask<T, I, O, P> => {
    //console.log("Init task:", JSON.stringify(spec, null, "  "));
    const id = spec.id;
    const title = spec.title ?? "";
    const description = spec.description ?? "";
    const type: T = spec.type ?? "" as T;
    const properties: P = spec?.properties ?? {} as P;
    const runFunc = spec.run;
    const abortFunc = spec.abort;
    //const actions = spec.actions;
    const state = map<AgentTaskState>({
        isRunning: false,
        isCompleted: false,
        data: null,
    });

    const _run = async (params: I, conf: Record<string, any>, autoComplete: boolean): Promise<O> => {
        //console.log("TASK run task", id, autoComplete, params);
        state.setKey("isRunning", true);
        state.setKey("data", null);
        let data: O;
        if (runFunc) {
            try {
                const d = await runFunc(params, conf);
                data = d;
                if (autoComplete) {
                    finish(true, data)
                }
                return data
            } catch (e) {
                throw new Error(`Error running task ${id}: ${e}`)
            }
        } else {
            throw new Error(`Error running task ${id}: no run function is defined for the task`)
        }
    }

    const run = async (params: I, conf: Record<string, any> = {}): Promise<O> => {
        return _run(params, conf, true)
    }

    const start = async (params: I, conf: Record<string, any> = {}): Promise<O> => {
        return _run(params, conf, false)
    }

    const finish = (completed: boolean, data?: O): void => {
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
        properties,
        type,
        state,
        run,
        abort,
        start,
        finish,
    }
};

export { useAgentTask }