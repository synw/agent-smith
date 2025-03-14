import { AgentTask, useAgentTask } from "@agent-smith/jobs";
import { getFeatureSpec } from '../../state/features.js';
import { FeatureType, NodeReturnType } from "../../interfaces.js";
import { readYmlAction } from "../sys/read_yml_action.js";
import { execute } from "../sys/execute.js";
import { runPyScript } from "../sys/run_python.js";
import { pyShell } from "../../state/state.js";
import { createJsAction, parseInputOptions, processOutput } from "./utils.js";

function systemAction(path: string): AgentTask<FeatureType, Array<string>, NodeReturnType<string>> {
    const action = useAgentTask<FeatureType, Array<string>, NodeReturnType<string>>({
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
            return { data: out.trim() }
        }
    });
    return action
}

function pythonAction(
    path: string
): AgentTask<FeatureType, any, NodeReturnType<string | Record<string, any> | Array<any>>> {
    const action = useAgentTask<FeatureType, any, NodeReturnType<string | Record<string, any> | Array<any>>>({
        id: "python_action",
        title: "",
        run: async (args) => {
            //console.log("Py action", path);
            const { data, error } = await runPyScript(
                pyShell,
                "python3",
                path,
                args,
            )
            /*console.log("----------------");
            console.log("PYOUT", out);
            console.log("----------------");*/
            if (error) {
                return { data: {}, error: error }
            }
            const txt = data.join("\n");
            let final: string | Record<string, any> | Array<any> = txt;
            if (txt.startsWith("{") || txt.startsWith("[")) {
                final = JSON.parse(final)
            }
            const res: NodeReturnType<string | Record<string, any> | Array<any>> = { data: final }
            return res
        }
    });
    return action
}

async function executeActionCmd(args: Array<string> = [], options: any = {}, quiet = false): Promise<NodeReturnType<any>> {
    const name = args.shift()!;
    const { found, path, ext } = getFeatureSpec(name, "action" as FeatureType);
    if (!found) {
        throw new Error("Action not found");
    }
    let act: AgentTask<FeatureType, any, NodeReturnType<any>>;
    switch (ext) {
        case "js":
            const { action } = await import(path);
            act = action as AgentTask<FeatureType, any, NodeReturnType<any>>;
            break;
        case "mjs":
            const mjsa = await import(path);
            act = createJsAction(mjsa.action);
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
    //console.log("ACT RES", res);
    if (res?.error) {
        throw res.error
    }
    if (!quiet) {
        console.log(res.data);
    }
    await processOutput(res);
    return { data: res.data }
}

export { executeActionCmd, systemAction, pythonAction };
