import { map } from 'nanostores';
import { AgentTask, type AgentTaskSpec } from "./interfaces.js";


const useAgentTask = (spec: AgentTaskSpec): AgentTask => {
    //console.log("Init task:", JSON.stringify(spec, null, "  "));
    //console.log("F", spec.run)
    let data = {};
    const name = spec.name;
    const title = spec.title;
    const description = spec.description;
    const runFunc = spec.run;
    const abortFunc = spec.abort;
    //const actions = spec.actions;
    const state = map({
        isRunning: false,
        isCompleted: false,
    });

    const run = async (params: any): Promise<Record<string, any>> => {
        //console.log("TASK run task", name, JSON.stringify(params, null, "  "));
        //console.log("RUN F", runFunc.name);
        state.setKey("isRunning", true);
        const d = await runFunc(params);
        state.setKey("isRunning", false);
        data = d;
        state.setKey("isCompleted", true);
        return d
    }

    const abort = async (params: any = null) => {
        if (!abortFunc) {
            console.warn(`The task ${name} has no abort method`)
            return
        }
        if (!state.get().isRunning) {
            throw new Error("Nothing to abort, no task is running")
        }
        await abortFunc(params);
        state.setKey("isRunning", false);
        state.setKey("isCompleted", false);
        data = {};
    }

    return {
        name,
        title,
        description,
        state,
        data,
        run,
        abort,
    }
};

export { useAgentTask }