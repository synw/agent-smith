import { getFeatureSpec } from '../../../state/features.js';
import { FeatureExecutor, FeatureType } from "../../../interfaces.js";
import { readYmlFile } from "../../sys/read_yml_file.js";
import { execute } from "../../sys/execute.js";
import { runPyScript } from "../../sys/run_python.js";
import { pyShell } from "../../../state/state.js";
import { createJsAction } from "./read.js";
import { runtimeError } from "../../../utils/user_msgs.js";
import { readClipboard } from "../../sys/clipboard.js";
import { processOutput, readPromptFile } from "../utils.js";
import { parseCommandArgs } from "../options_parsers.js";
import { pathToFileURL } from 'url';

async function executeAction(name: string, payload: any, options: Record<string, any>, quiet = false) {
    let run: FeatureExecutor<any, any>;
    const { found, path, ext } = getFeatureSpec(name, "action" as FeatureType);
    if (!found) {
        throw new Error(`Action ${name} not found at ${path}`);
    }
    //console.log("CREATE ACTION", name, ext, path);
    switch (ext) {
        case "js":
            const url = pathToFileURL(path).href;
            const mjsa = await import(url);
            run = createJsAction(mjsa.action);
            break;
        case "yml":
            run = systemAction(path);
            break
        case "py":
            run = pythonAction(path);
            break
        default:
            throw new Error(`Action ext ${ext} not implemented`)
    }
    const res = await run(payload, options);
    if (!quiet) {
        if (res) {
            console.log(res);
        }
    }
    await processOutput(res);
    return res
}

async function executeActionCmd(
    name: string, aargs: Array<any>, quiet = false
): Promise<any> {
    //console.log("AARGs", aargs)
    const { args, options } = parseCommandArgs(aargs);
    //console.log("CMDA", args)
    const params = args;
    if (options?.clipBoardInput) {
        params.push(await readClipboard())
    } else if (options?.inputFile) {
        params.push(readPromptFile())
    }
    if (options?.debug) {
        console.log("Action", name, "params", params);
    }
    return await executeAction(name, params, options, quiet)
}


function systemAction(path: string): FeatureExecutor<Array<string>, any> {
    const run: FeatureExecutor = async (params: any) => {
        //console.log("SYS ACTION PARAMS", params);
        let runArgs = new Array<string>();
        // convert args for tool calls
        if (!Array.isArray(params)) {
            try {
                // obviously a tool call
                if (typeof params == "string") {
                    runArgs.push(params)
                } else {
                    runArgs = Object.values(params)
                }
            } catch (e) {
                throw new Error(`wrong python action args: ${e}`)
            }
        } else {
            runArgs = params
        }
        const actionSpec = readYmlFile(path);
        if (!actionSpec.found) {
            runtimeError("System action yml file", path, "not found")
        }
        //console.log("Yml action", JSON.stringify(actionSpec.data, null, "  "));
        //console.log("Args", args)
        if (!actionSpec.data?.args) {
            actionSpec.data.args = []
        }
        //console.log("EXEC", actionSpec.data.cmd, [...actionSpec.data.args, ...runArgs]);
        const out = await execute(actionSpec.data.cmd, [...actionSpec.data.args, ...runArgs]);
        return out.trim()
    }
    return run
}

function pythonAction(
    path: string
): FeatureExecutor<Array<string>> {
    const run: FeatureExecutor = async (params: any) => {
        //console.log("PY ACTION PARAMS", params);
        let runArgs = new Array<string>();
        if (!Array.isArray(params)) {
            try {
                // obviously a tool call
                if (typeof params == "string") {
                    runArgs.push(params)
                } else {
                    runArgs = Object.values(params)
                }
            } catch (e) {
                throw new Error(`wrong python action args: ${e}`)
            }
        } else {
            runArgs = params
        }
        //console.log("Py action", path);
        const { data, error } = await runPyScript(
            pyShell,
            "python3",
            path,
            runArgs,
        )
        /*console.log("----------------");
        console.log("PYOUT", data);
        console.log("----------------");*/
        if (error) {
            throw new Error(`python error: ${error}`)
        }
        let txt = data[0];
        if (data.length > 1) {
            txt = data.join("\n");
        }
        let final: string | Record<string, any> | Array<any> = txt;
        if (txt.startsWith("{") || txt.startsWith("[")) {
            try {
                final = JSON.parse(txt)
            } catch (e) {
                //throw new Error(`python error: ${error}`) 
            }
        }
        return final
    }
    return run
}

export {
    executeAction,
    executeActionCmd,
    systemAction,
    pythonAction,
};
