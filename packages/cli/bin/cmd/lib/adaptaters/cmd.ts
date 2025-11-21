import { getFeatureSpec } from "../../../state/features.js";
import { FeatureExecutor, FeatureType } from "../../../interfaces.js";
import { createJsAction } from "../actions/read.js";
import { pathToFileURL } from 'url';

async function executeAdaptater(
    name: string,
    params: any,
    options: Record<string, any>
): Promise<any> {
    /*if (params?.args) {
        params = params.args;
    }*/
    const { found, path } = getFeatureSpec(name, "adaptater" as FeatureType);
    if (!found) {
        throw new Error(`adaptater ${name} not found`);
    }
    let run: FeatureExecutor<any, any>;
    const url = pathToFileURL(path).href;
    const jsa = await import(url);
    run = createJsAction(jsa.action);
    let res;
    try {
        //console.log("ADAPT RUN PARAMS", params);
        res = await run(params, options);
        //console.log("ADAPT RES", res);
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