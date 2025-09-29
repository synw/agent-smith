import { getFeatureSpec } from "../../../state/features.js";
import { FeatureExecutor, FeatureType } from "../../../interfaces.js";
import { createJsAction } from "../actions/read.js";

async function executeAdaptater(
    name: string,
    params: any,
    options: Record<string, any>
): Promise<any> {
    if (params?.args) {
        params = params.args;
    }
    const { found, path } = getFeatureSpec(name, "adaptater" as FeatureType);
    if (!found) {
        throw new Error(`adaptater ${name} not found`);
    }
    let run: FeatureExecutor<any, any>;
    const jsa = await import(path);
    run = createJsAction(jsa.action);
    let res;
    try {
        //console.log("ADAPT RUN", { ...conf, ...vars });
        res = await run(params, options);
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