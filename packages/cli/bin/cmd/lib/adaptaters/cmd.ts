import { getFeatureSpec } from "../../../state/features.js";
import { FeatureType } from "../../../interfaces.js";
import { AgentTask } from "@agent-smith/jobs";
import { createJsAction } from "../actions/read.js";

async function executeAdaptater(
    name: string,
    argsOrParams: Record<string, any> | Array<any>,
    options: Record<string, any>
): Promise<any> {
    const { found, path } = getFeatureSpec(name, "adaptater" as FeatureType);
    if (!found) {
        throw new Error(`adaptater ${name} not found`);
    }
    let act: AgentTask<FeatureType, Array<string> | Record<string, any>, any>;
    const jsa = await import(path);
    act = createJsAction(jsa.action);
    let res;
    try {
        //console.log("ADAPT RUN", { ...conf, ...vars });
        res = await act.run(argsOrParams, options);
        //sconsole.log("ADAPT RES", res);
    } catch (e) {
        throw new Error(`adaptater ${name}: ${e}`)
    }
    if (res?.error) {
        throw res.error
    }
    //await processOutput(res);
    //console.log("ADRES", res);
    return res
}

export {
    executeAdaptater,
}