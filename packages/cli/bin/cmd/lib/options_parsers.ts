import { InferenceParams } from "@locallm/types";
import { LmTaskConfig } from "../../interfaces.js";

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
    res.args = args[0];
    return res
}

function parseTaskConfigOptions(options: Record<string, any>): LmTaskConfig {
    const conf: LmTaskConfig = { inferParams: {}, modelname: "", templateName: "" };
    const optionsInferParams: InferenceParams = {};
    if (options?.temperature) {
        optionsInferParams.temperature = options.temperature
    }
    if (options?.top_k) {
        optionsInferParams.top_k = options.top_k
    }
    if (options?.top_p) {
        optionsInferParams.top_p = options.top_p
    }
    if (options?.min_p) {
        optionsInferParams.min_p = options.min_p
    }
    if (options?.max_tokens) {
        optionsInferParams.max_tokens = options.max_tokens
    }
    if (options?.repeat_penalty) {
        optionsInferParams.repeat_penalty = options.repeat_penalty
    }
    if (options?.model) {
        conf.modelname = options.model;
    }
    if (options?.template) {
        conf.templateName = options.template
    }
    conf.inferParams = optionsInferParams;
    return conf
}

export {
    parseCommandArgs,
    parseTaskConfigOptions,
}