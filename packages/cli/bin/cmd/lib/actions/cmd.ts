import { AgentTask, useAgentTask } from "@agent-smith/jobs";
import { getFeatureSpec } from '../../../state/features.js';
import { FeatureType } from "../../../interfaces.js";
import { readYmlAction } from "../../sys/read_yml_action.js";
import { execute } from "../../sys/execute.js";
import { runPyScript } from "../../sys/run_python.js";
import { pyShell } from "../../../state/state.js";
import { createJsAction } from "./read.js";

function systemAction(path: string): AgentTask<FeatureType, Array<string>, any> {
    const action = useAgentTask<FeatureType, Array<string>, any>({
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
): AgentTask<FeatureType, Array<string>> {
    const action = useAgentTask<FeatureType, Array<string>, any>({
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
                throw new Error(`python error: ${error}`)
            }
            const txt = data.join("\n");
            let final: string | Record<string, any> | Array<any> = txt;
            if (txt.startsWith("{") || txt.startsWith("[")) {
                try {
                    final = JSON.parse(txt)
                } catch (e) { }
            }
            return final
        }
    });
    return action
}

async function executeActionCmd(
    args: Array<string> | Record<string, any> = [], options: any = {}, quiet = false
): Promise<any> {
    //console.log("AARGS", args);
    const isWorkflow = !Array.isArray(args);
    let name: string;
    if (!isWorkflow) {
        name = args.shift()!;
    } else {
        if (!args.name) {
            throw new Error("Provide an action name param")
        }
        name = args.name;
        delete args.name;
    }
    const { found, path, ext } = getFeatureSpec(name, "action" as FeatureType);
    if (!found) {
        throw new Error(`Action ${name} not found at ${path}`);
    }
    let act: AgentTask<FeatureType, any, any>;
    /*if (isWorkflow) {
        if (!["js"].includes(ext)) {
            throw new Error(`Action ${name} param error: ${typeof args}, ${args}`)
        }
    }*/
    switch (ext) {
        case "js":
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
    /*console.log("AARGS2", args);
    const input = await parseInputOptions(options);
    if (input) {
        args.push(input)
    }*/
    // run
    //console.log("AOPT", options);
    //console.log("AARGS3", args);
    const res = await act.run(args, options);
    //console.log("ACT RES", res);
    if (res?.error) {
        throw res.error
    }
    if (!quiet) {
        if (res) {
            console.log(res);
        }
    }
    //await processOutput(res);
    return res
}

export { executeActionCmd, systemAction, pythonAction };
