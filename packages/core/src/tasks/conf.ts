import type { LmTaskConfig, InferenceParams } from "@agent-smith/types";

/*function configureTaskModel(itConf: LmTaskConfig, taskSpec: LmTaskFileSpec): ModelSpec {
    //console.log("IT CONF", itConf);
    //console.log("TASK SPEC", taskSpec);
    //let modelName: string = "";
    //let templateName: string = "";
    let ip = itConf.inferParams;
    let isModelFromTaskFile = false;
    let model = "";
    let foundModel = false;
    let foundTemplate = false;
    if (itConf?.templateName) {
        model.template = itConf.templateName;
        foundTemplate = true;
    }
    if (!foundTemplate) {
        if (itConf?.model?.name) {
            const gt = guessTemplate(itConf.model.name);
            model.template = gt;
            foundTemplate = true;
        } else if (taskSpec?.model?.template) {
            model.template = taskSpec.model.template;
            foundTemplate = true;
        } else {
            const gt = guessTemplate(taskSpec.model.name);
            model.template = gt;
            foundTemplate = true;
        }
    }
    if (itConf?.model) {
        if (taskSpec?.models && Object.keys(taskSpec.models).includes(itConf.model.name)) {
            // try to find the model from the task's models
            for (const [k, v] of Object.entries(taskSpec.models)) {
                //console.log("TSM", modelName, "/", k);
                if (k == itConf.model.name) {
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
                    foundModel = true;
                    break
                }
            }
        } else {
            model.name = itConf.model.name;
            foundModel = true;
        }
    } else {
        if (!taskSpec?.model) {
            throw new Error(`No model found: either specify a model in the task or use the -m flag`)
        }
        model = taskSpec.model;
        foundModel = true;
    }
    // try to find the models from db models
    // fallback to use the model name directly
    if (!foundModel) {
        throw new Error(`No model found in task`)
    }

    //model.inferParams = ip;
    // use default ctx if the model is not from defined in the task file
    if (!model?.ctx || !isModelFromTaskFile) {
        model.ctx = taskSpec.ctx
    }
    //model.inferParams = ip;
    return model
}*/

function mergeConfOptions(conf: LmTaskConfig, options: Record<string, any>): LmTaskConfig {
    const res: Record<string, any> = conf;
    for (const [k, v] of Object.entries(options)) {
        if (k == "inferParams") {
            continue
        }
        res[k] = v
    }
    return res as LmTaskConfig
}

function mergeInferParams(
    userInferParams: Record<string, any>,
    taskInferParams: InferenceParams
): InferenceParams {
    const ip = taskInferParams as Record<string, any>;
    //console.log("IP", ip);
    for (const [k, v] of Object.entries(userInferParams)) {
        ip[k] = v
    }
    return ip as InferenceParams
}

export {
    mergeConfOptions,
    mergeInferParams,
}