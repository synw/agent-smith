import { AgentTask, useAgentTask } from "@agent-smith/jobs";
import { getFeatureSpec } from '../../state/features.js';
import { FeatureType } from "../../interfaces.js";
import { readYmlAction } from "../sys/read_yml_action.js";
import { execute } from "../sys/execute.js";
import { runPyScript } from "../sys/run_python.js";
import { pyShell } from "../../state/state.js";
import { parseInputOptions, processOutput } from "./utils.js";

function systemAction(path: string): AgentTask<FeatureType> {
    const action = useAgentTask<FeatureType>({
        id: "system_action",
        title: "",
        run: async (args) => {
            const actionSpec = readYmlAction(path);
            //console.log("Yml action", JSON.stringify(actionSpec, null, "  "));
            //console.log("Args", args)
            if (!actionSpec.data?.args) {
                actionSpec.data.args = []
            }
            const out = await execute(actionSpec.data.cmd, [...actionSpec.data.args, ...args]);
            return { data: out.trim(), error: "", ok: true }
        }
    });
    return action
}

function pythonAction(path: string): AgentTask<FeatureType> {
    const action = useAgentTask<FeatureType>({
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
            //console.log("PYOUT", out);
            return { data: out.join("\n"), error: "", ok: true }
        }
    });
    return action
}

async function executeActionCmd(args: Array<string> = [], options: any = {}, quiet = false): Promise<any> {
    const name = args.shift()!;
    const { found, path, ext } = getFeatureSpec(name, "action" as FeatureType);
    if (!found) {
        return { ok: false, data: {}, error: "Action not found" };
    }
    let act: AgentTask;
    switch (ext) {
        case "js":
            const { action } = await import(path);
            act = action as AgentTask;
            break;
        case "yml":
            act = systemAction(path);
            break
        case "py":
            act = pythonAction(path);
            break
        default:
            throw new Error(`Action ext ${ext} not implemented`)
    }
    // options
    const input = await parseInputOptions(options);
    if (input) {
        args.push(input)
    }
    // run
    const res = await act.run(args, {});
    if (!quiet) {
        console.log(res.data);
    }
    await processOutput(res);
    return { ok: true, data: res.data, error: "" }
}

export { executeActionCmd, systemAction, pythonAction };
