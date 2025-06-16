import { InferenceParams } from "@locallm/types";
import { LmTaskConfig } from "../../interfaces.js";
import { inputMode } from "../../state/state.js";

function parseCommandArgs(args: Array<any>): {
    args: Array<any>,
    options: Record<string, any>,
} {
    const res = {
        args: new Array<any>(),
        options: {},
    }
    //discard the command (last arg)
    args.pop();
    res.options = args.pop();
    res.args = Array.isArray(args[0]) ? args[0] : args;
    //console.log("PARSE ARGS RES", res.args);
    return res
}

function parseTaskConfigOptions(options: Record<string, any>): LmTaskConfig {
    const conf: LmTaskConfig = { inferParams: {}, modelname: "", templateName: "" };
    const optionsInferParams: InferenceParams = {};
    if (options?.temperature) {
        optionsInferParams.temperature = options.temperature
    }
    if (options?.top_k !== undefined) {
        optionsInferParams.top_k = options.top_k
    }
    if (options?.top_p !== undefined) {
        optionsInferParams.top_p = options.top_p
    }
    if (options?.min_p !== undefined) {
        optionsInferParams.min_p = options.min_p
    }
    if (options?.max_tokens !== undefined) {
        optionsInferParams.max_tokens = options.max_tokens
    }
    if (options?.repeat_penalty !== undefined) {
        optionsInferParams.repeat_penalty = options.repeat_penalty
    }
    if (options?.images) {
        optionsInferParams.images = options.images
    }
    if (options?.model !== undefined) {
        conf.modelname = options.model;
    }
    if (options?.template !== undefined) {
        conf.templateName = options.template
    }
    conf.inferParams = optionsInferParams;
    return conf
}

export {
    parseCommandArgs,
    parseTaskConfigOptions,
}