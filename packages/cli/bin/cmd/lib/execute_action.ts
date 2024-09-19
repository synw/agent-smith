import { AgentTask, useAgentTask } from "@agent-smith/jobs";
import { getFeatureSpec } from '../../state/features.js';
import { FeatureType } from "../../interfaces.js";
import { readYmlAction } from "../sys/read_yml_action.js";
import { execute } from "../sys/execute.js";
import { runPyScript } from "../sys/run_python.js";
import { pyShell } from "../../state/state.js";

function _systemAction(path: string): AgentTask {
    const action = useAgentTask({
        id: "system_action",
        title: "",
        run: async (args) => {
            const actionSpec = readYmlAction(path);
            //console.log("Yml action", JSON.stringify(actionSpec, null, "  "));
            //console.log("Args", args)
            const out = await execute(actionSpec.data.cmd, [...actionSpec.data.args, ...args]);
            return { data: out, error: "", ok: true }
        }
    });
    return action
}

function _pythonAction(path: string): AgentTask {
    const action = useAgentTask({
        id: "python_action",
        title: "",
        run: async (args) => {
            //console.log("Py action", path);
            const out = await runPyScript(
                pyShell,
                "python3",
                path,
                args,
            )
            return { data: out[0], error: "", ok: true }
        }
    });
    return action
}

async function executeActionCmd(args: Array<string> = [], options: any = {}, quiet = false): Promise<any> {
    const name = args.shift()!;
    const { found, path, ext } = getFeatureSpec(name, "action" as FeatureType);
    if (!found) {
        return { ok: false, data: {}, error: "FeatureType not found" };
    }
    let act: AgentTask;
    switch (ext) {
        case "js":
            const { action } = await import(path);
            act = action as AgentTask;
            break;
        case "yml":
            act = _systemAction(path);
            break
        case "py":
            act = _pythonAction(path);
            break
        default:
            throw new Error(`Action ext ${ext} not implemented`)
            break;
    }
    const res = await act.run(args);
    if (!quiet) {
        console.log(res.data);
    }
    //await processOutput(res.data);
    return { ok: true, data: res.data, error: "" }
}

export { executeActionCmd };
