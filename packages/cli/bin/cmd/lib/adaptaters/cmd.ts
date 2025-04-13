import { getFeatureSpec } from "../../../state/features.js";
import { FeatureType } from "../../../interfaces.js";
import { AgentTask } from "@agent-smith/jobs";
import { createJsAction } from "../actions/read.js";

async function executeAdaptaterCmd(
    args: Array<string> | Record<string, any> = [], options: any = {}
): Promise<any> {
    //console.log("AARGS", args);
    const isWorkflow = !Array.isArray(args);
    let name: string;
    if (!isWorkflow) {
        name = args.shift()!;
    } else {
        if (!args.name) {
            throw new Error("provide an adaptater name param")
        }
        name = args.name;
        delete args.name;
    }
    const { found, path } = getFeatureSpec(name, "adaptater" as FeatureType);
    if (!found) {
        throw new Error(`adaptater ${name} not found`);
    }
    let act: AgentTask<FeatureType, Array<string> | Record<string, any>, any>;
    const jsa = await import(path);
    act = createJsAction(jsa.action);
    let res;
    try {
        res = await act.run(args, options);
        //sconsole.log("ADAPT RES", res);
    } catch (e) {
        throw new Error(`adaptater ${name}: ${e}`)
    }
    if (res?.error) {
        throw res.error
    }
    //await processOutput(res);
    return res
}

export {
    executeAdaptaterCmd,
}