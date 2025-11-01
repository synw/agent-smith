import { PromptTemplate } from "modprompt";
import { TaskDef } from "./interfaces.js";
import { useTemplateForModel } from "@agent-smith/tfm";

const tfm = useTemplateForModel();

function formatTaskTemplate(taskDef: TaskDef, templateName?: string): PromptTemplate {
    //console.log("FTTaskdef", taskDef);
    //console.log("FTTpl", templateName);
    if (!taskDef?.model) {
        throw new Error("Provide a model to run the task " + taskDef.name);
    }
    if ((!taskDef.model?.template)) {
        const gt = tfm.guess(taskDef.model.name);
        if (gt == "none") {
            throw new Error(`Unable to guess the template for ${taskDef.model}: please provide a template name in the task definition`)
        }
        taskDef.model.template = gt;
    }
    const tpl = new PromptTemplate(templateName ?? taskDef.model.template);
    if (taskDef?.template) {
        if (taskDef.template?.system) {
            tpl.replaceSystem(taskDef.template.system)
        }
        if (taskDef.template?.afterSystem) {
            tpl.afterSystem(taskDef.template.afterSystem)
        }
        if (taskDef.template?.assistant) {
            tpl.afterAssistant(" " + taskDef.template.assistant)
        }
        if (taskDef.template?.stop) {
            const tps = tpl?.stop ?? [];
            tpl.stop = [...tps, ...taskDef.template.stop]
        }

    }
    // model overrides
    if (taskDef.model?.system) {
        tpl.replaceSystem(taskDef.model.system)
    }
    if (taskDef.model?.afterSystem) {
        tpl.afterSystem(taskDef.model.afterSystem)
    }
    if (taskDef.model?.assistant) {
        tpl.afterAssistant(taskDef.model.assistant)
    }
    // shots
    if (taskDef?.shots) {
        taskDef.shots.forEach((s) => {
            //console.log("** SHOT", s);
            tpl.addShot(s)
        });
    }
    return tpl
}

export {
    formatTaskTemplate,
}