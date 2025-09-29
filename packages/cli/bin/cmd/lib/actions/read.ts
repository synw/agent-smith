import { FeatureExecutor } from "../../../interfaces.js";

function createJsAction(action: CallableFunction): FeatureExecutor {
    const run: FeatureExecutor = async (args, options) => {
        //console.log("JS ACTION PARAMS", args);
        try {
            const res = await action(args, options);
            return res
        }
        catch (e) {
            throw new Error(`executing action:${e}`);
        }
    };
    return run
}

export { createJsAction }