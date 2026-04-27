import { FeatureExecutor } from "../../../interfaces.js";

function createJsAction(action: CallableFunction): FeatureExecutor {
    const run: FeatureExecutor = async (args, options) => {
        //console.log("JS ACTION PARAMS", args);
        try {
            const res = await action(args, options);
            return res
        }
        catch (e: any) {
            /*if (e?.text) {
                throw new Error(`executing action:${e.text()}. Args: ${args}`);
            }*/
            throw new Error(`executing action:${e}. Args: ${args}`);
        }
    };
    return run
}

export { createJsAction }