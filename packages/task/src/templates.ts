import { PromptTemplate } from "modprompt";
import { TaskDef } from "./interfaces.js";
import { useTemplateForModel } from "@agent-smith/tfm";

const tfm = useTemplateForModel();

function formatTaskTemplate(taskDef: TaskDef, templateName?: string): PromptTemplate {
    if ((!taskDef.model?.template)) {
        const gt = tfm.guess(taskDef.model.name);
        if (gt == "none") {
            throw new Error(`Unable to guess the template for ${taskDef.model}: please provide a template in the taskDef definition`)
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