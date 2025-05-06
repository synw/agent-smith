import { InferenceParams } from "@locallm/types";
import { LmTaskConfig } from "../interfaces.js";

function parseArgs(params: Record<string, any> | Array<any>, checkPrompt = false): {
    conf: LmTaskConfig,
    vars: Record<string, any>,
    args: Array<string>,
} {
    switch (Array.isArray(params)) {
        case true:
            return parseArrayArgs(params as Array<any>)
        default:
            return { ...parseObjectArgs(params, checkPrompt), args: [] }
    }
}

function parseObjectArgs(params: Record<string, any>, checkPrompt: boolean): {
    conf: LmTaskConfig,
    vars: Record<string, any>,
} {
    const conf: LmTaskConfig = { inferParams: {}, modelname: "", templateName: "" };
    if (checkPrompt) {
        if (!params?.prompt) {
            throw new Error(`args parsing error: provide a prompt`)
        }
    }
    if (params?.images) {
        conf.inferParams.images = params.images;
        delete params.images;
    }
    if (params?.modelname) {
        conf.modelname = params.modelname;
        delete params.modelname;
    }
    if (params?.template) {
        conf.templateName = params.templateName;
        delete params.templateName;
    }
    if (params?.m) {
        if (params.m.includes("/")) {
            const _s = params.m.split("/");
            conf.modelname = _s[0];
            conf.templateName = _s[1];
        } else {
            conf.modelname = params.m;
        }
    }
    if (params?.ip) {
        conf.inferParams = params.ip as InferenceParams;
    }
    const res = { conf: conf, vars: params };
    return res
}

function parseArrayArgs(args: Array<string>): {
    conf: LmTaskConfig,
    vars: Record<string, any>,
    args: Array<string>,
} {
    const _vars: Record<string, any> = {};
    const _conf: Record<string, any> = { inferParams: {} };
    const _nargs = new Array<string>();
    //console.log("PARSE ARGS", args);
    args.forEach((a) => {
        if (a.includes("=")) {
            const t = a.split("=", 2);
            const k = t[0];
            const v = t[1];
            switch (k) {
                case "m":
                    if (v.includes("/")) {
                        const _s = v.split("/");
                        _conf.modelname = _s[0];
                        _conf.templateName = _s[1];
                    } else {
                        _conf.modelname = v;
                    }
                    break;
                case "ip":
                    v.split(",").forEach((p: string) => {
                        const s = p.split(":");
                        _conf.inferParams[s[0]] = parseFloat(s[1]);
                    });
                    break;
                default:
                    _vars[k] = v;
                    break
            }
        } else {
            _nargs.push(a)
        }
    });
    return { conf: _conf as LmTaskConfig, vars: _vars, args: _nargs }
}

export {
    parseArgs,
}