import { InferenceParams } from "@locallm/types";
import { useTemplateForModel } from "@agent-smith/tfm";
import { LmTaskConfig, LmTaskFileSpec, ModelSpec } from "../../../interfaces.js";
import { readModel } from "../../../db/read.js";

const tfm = useTemplateForModel();

function configureTaskModel(itConf: LmTaskConfig, taskSpec: LmTaskFileSpec): ModelSpec {
    //console.log("IT CONF", itConf);
    let modelName: string = "";
    let templateName: string = "";
    let ip = itConf.inferParams;
    let isModelFromTaskFile = false;
    let model = {} as ModelSpec;
    let found = false;
    if (itConf?.templateName) {
        templateName = itConf.templateName
    }
    if (!itConf?.modelname) {
        if (taskSpec?.model?.name) {
            model = taskSpec.model!;
            isModelFromTaskFile = true;
            found = true;
        } else {
            if (!taskSpec?.modelpack) {
                throw new Error("provide a default model or a use a modelpack in the task definition")
            }
            modelName = taskSpec.modelpack.default;
        }
    } else {
        modelName = itConf.modelname
    }
    if (!found) {
        if (modelName.length == 0) {
            throw new Error("no model name defined")
        }
        // try to find the model from the task's models
        if (taskSpec?.models) {
            for (const [k, v] of Object.entries(taskSpec.models)) {
                //console.log("TSM", modelName, "/", k);
                if (modelName == k) {
                    model = v;
                    if (v?.inferParams) {
                        const tip = v.inferParams as Record<string, any>;
                        for (const [k, v] of Object.entries(tip)) {
                            // @ts-ignore
                            ip[k] = v;
                        }
                    }
                    if (v?.system) {
                        model.system = v.system;
                    }
                    if (v.assistant) {
                        model.assistant = v.assistant;
                    }
                    isModelFromTaskFile = true;
                    found = true;
                    break
                }
            }
        }
        // try to find the models from db models
        if (!found) {
            const m = readModel(modelName);
            if (m.found) {
                model = m.modelData as ModelSpec;
                found = true
            }
        }
    }
    // fallback to use the model name directly
    if (!found) {
        //console.log("Model name end param", modelName);
        // try to guess the template
        const gt = tfm.guess(modelName);
        if (gt == "none") {
            throw new Error(`Unable to guess the template for ${modelName}: please provide a template name: m="modelname/templatename"`)
        }
        const m: ModelSpec = {
            name: modelName,
            template: gt
        };
        model = m;
    }
    model.inferParams = ip;
    // use default ctx if the model is not from defined in the task file
    if (!model?.ctx || !isModelFromTaskFile) {
        model.ctx = taskSpec.ctx
    }
    model.inferParams = ip;
    if (templateName.length > 0) {
        model.template = templateName;
    }
    return model
}

function parseTaskVars(
    params: Array<any> | Record<string, any>, inferParams: Record<string, any>
): { conf: LmTaskConfig, vars: Record<string, any> } {
    switch (Array.isArray(params)) {
        case true:
            return _initTaskVars(params as Array<any>, inferParams)
        default:
            return _initTaskParams(params as Record<string, any>, inferParams)
    }
}

function _initTaskParams(
    params: Record<string, any>, inferParams: Record<string, any>
): { conf: LmTaskConfig, vars: Record<string, any> } {
    //console.log("TASK PARAMS", params);
    const conf: LmTaskConfig = { inferParams: inferParams, modelname: "", templateName: "" };
    if (!params?.prompt) {
        throw new Error(`Error initializing task params: provide a prompt`)
    }
    if (params?.images) {
        conf.inferParams.images = params.images;
        delete params.images;
    }
    if (params?.model) {
        conf.modelname = params.model;
        delete params.model;
    }
    if (params?.template) {
        conf.templateName = params.template;
        delete params.template;
    }
    const res = { conf: conf, vars: params };
    return res
}

function _initTaskVars(
    args: Array<any>, inferParams: Record<string, any>
): { conf: LmTaskConfig, vars: Record<string, any> } {
    const conf: LmTaskConfig = { inferParams: inferParams, modelname: "", templateName: "" };
    const vars: Record<string, any> = {};
    //console.log("ARGS", args);
    args.forEach((a) => {
        if (a.includes("=")) {
            const delimiter = "=";
            const [k, v] = a.split(delimiter, 2);
            if (v === undefined) {
                throw new Error(`invalid parameter ${a}`)
            }
            switch (k) {
                case "m":
                    if (v.includes("/")) {
                        const _s = v.split("/");
                        conf.modelname = _s[0];
                        conf.templateName = _s[1];
                    } else {
                        conf.modelname = v;
                    }
                    break;
                case "ip":
                    v.split(",").forEach((p: string) => {
                        const s = p.split(":");
                        const cip = conf.inferParams as Record<string, any>;
                        cip[s[0]] = parseFloat(s[1]);
                        conf.inferParams = cip as InferenceParams;
                    });
                    break;
                default:
                    vars[k] = v;
                    break;
            }
        }
    });
    return { conf, vars }
}

export {
    parseTaskVars,
    configureTaskModel,
}