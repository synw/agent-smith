import { InferenceParams } from "@locallm/types";
import { useTemplateForModel } from "@agent-smith/tfm";
import { LmTaskConfig, LmTaskFileSpec, ModelSpec } from "../../../interfaces.js";
import { readModel } from "../../../db/read.js";

const tfm = useTemplateForModel();

function configureTaskModel(itConf: LmTaskConfig, taskSpec: LmTaskFileSpec): ModelSpec {
    //console.log("IT CONF", itConf);
    //console.log("TASK SPEC", taskSpec);
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
            if (!taskSpec?.modelpack?.default) {
                throw new Error(`provide a default model or a use a modelpack in the ${taskSpec.name} task yaml file`)
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
    }
    // try to find the models from db models
    if (!found) {
        const m = readModel(modelName);
        //console.log("DBM", m);
        if (m.found) {
            model = m.modelData as ModelSpec;
            model.template = m.modelData.template;
            found = true
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
    mergeInferParams,
    configureTaskModel,
}