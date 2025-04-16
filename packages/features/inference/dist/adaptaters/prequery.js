import { parseInferenceArgs } from "@agent-smith/cli";

async function action(args) {
    const { inferenceVars, currentArgs } = parseInferenceArgs(args);
    const res = { prompt: currentArgs.join(" "), ...inferenceVars };
    return res;
}

export { action }