import type { InferenceParams } from "@locallm/types";
import { useTemplateForModel } from "@agent-smith/tfm";
import type { LmTaskConfig, LmTaskFileSpec, ModelSpec } from "../../../interfaces.js";

const tfm = useTemplateForModel();

function guessTemplate(modelname: string): string {
    const gt = tfm.guess(modelname);
    if (gt == "none") {
        throw new Error(`Unable to guess the template for ${modelname}: please provide a template name: --tpl templatename`)
    }
    return gt
}

function configureTaskModel(itConf: LmTaskConfig, taskSpec: LmTaskFileSpec): ModelSpec {
    //console.log("IT CONF", itConf);
    //console.log("TASK SPEC", taskSpec);
    //let modelName: string = "";
    //let templateName: string = "";
    let ip = itConf.inferParams;
    let isModelFromTaskFile = false;
    let model = { template: "", name: "" } as ModelSpec;
    let foundModel = false;
    let foundTemplate = false;
    //console.log("CONF", itConf);
    if (itConf?.templateName) {
        model.template = itConf.templateName;
        foundTemplate = true;
    }
    if (itConf?.model?.name) {
        if (itConf?.model?.name != taskSpec.model.name) {
            const gt = guessTemplate(itConf.model.name);
            model.template = gt;
            foundTemplate = true;
        }
    } else if (taskSpec?.model?.template) {
        model.template = taskSpec.model.template;
        foundTemplate = true;
    } else {
        const gt = guessTemplate(taskSpec.model.name);
        model.template = gt;
        foundTemplate = true;
    }
    if (itConf?.model?.name) {
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
        model = taskSpec.model;
        foundModel = true;
    }
    // try to find the models from db models
    /*if (!found) {
        const m = readModel(modelName);
        //console.log("FM", m.found, m)
        //console.log("DBM", templateName, "/", m.modelData.template);
        if (m.found) {
            model = m.modelData as ModelSpec;
            model.template = templateName ?? m.modelData.template;
            found = true
        }
    }*/
    // fallback to use the model name directly
    if (!foundModel) {
        throw new Error(`No model found in task`)
    }
    if (!foundTemplate) {
        // try to guess the template
        const gt = tfm.guess(model.name);
        if (gt == "none") {
            throw new Error(`Unable to guess the template for ${model.name}: please provide a template name: --tpl templatename`)
        }
        model.template = gt;
        foundTemplate = true;
    }
    if (!model?.template) {
        throw new Error(`No template found`)
    }
    //model.inferParams = ip;
    // use default ctx if the model is not from defined in the task file
    if (!model?.ctx || !isModelFromTaskFile) {
        model.ctx = taskSpec.ctx
    }
    //model.inferParams = ip;
    return model
}

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
    configureTaskModel,
}