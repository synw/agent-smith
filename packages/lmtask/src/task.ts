import YAML from 'yaml';
import { type AgentBrain } from "@agent-smith/brain";
import { AgentTask, AgentTaskSpec, useAgentTask } from "@agent-smith/jobs";
import { PromptTemplate } from "modprompt";
import { useTemplateForModel } from "@agent-smith/tfm";
import { LmTask } from "./interfaces.js";

const tfm = useTemplateForModel();

class LmTaskBuilder {
    brain: AgentBrain;

    constructor(agentBrain: AgentBrain) {
        this.brain = agentBrain;
    }

    readFromYaml(txt: string): LmTask {
        const data = YAML.parse(txt);
        return data
    }

    fromYaml(txt: string): AgentTask {
        const data = YAML.parse(txt);
        return this.init(data);
    }

    init(task: LmTask): AgentTask {
        const ts: AgentTaskSpec = {
            id: task.name,
            title: task.description,
            run: async (params: Record<string, string>) => {
                if (!params?.prompt) {
                    throw new Error("Please provide a prompt parameter");
                }
                let prompt = params.prompt;
                const tvars = params;
                delete tvars.prompt;
                let overrideModel = false;
                const modelOverride = { model: "", template: "" };
                if (tvars?.m) {
                    overrideModel = true;
                    if (tvars.m.includes("/")) {
                        const _s = tvars.m.split("/");
                        modelOverride.model = _s[0];
                        modelOverride.template = _s[1];
                    } else {
                        // try to guess the template
                        const gt = tfm.guess(tvars.m);
                        if (gt == "none") {
                            throw new Error(`Unable to guess the template for ${tvars.m}: please provide a template name: m="modelname/templatename"`)
                        }
                        modelOverride.model = tvars.m;
                        modelOverride.template = gt;
                    }
                    delete tvars.m;
                    //console.log("MO", modelOverride);
                }
                //console.log("Running task", task.name, ", params:", params);
                //console.log("Prompt", prompt);
                //console.log("Vars", tvars);
                const modelName = overrideModel ? modelOverride.model : task.model.name;
                const expert = this.brain.getExpertForModel(modelName);
                if (!expert) {
                    return { error: `Expert for model ${modelName} not found` }
                }
                const ex = this.brain.expert(expert);
                if (ex.lm.providerType == "ollama") {
                    if (ex.lm.model.name != modelName) {
                        await ex.lm.loadModel(modelName);
                    }
                } else if (ex.lm.model.name != modelName) {
                    throw new Error(`The ${modelName} model is not loaded on server (currently ${ex.lm.model.name})`)
                }
                const templateName = overrideModel ? modelOverride.template : task.template.name;
                const tpl = new PromptTemplate(templateName);
                if (task.template?.stop) {
                    const defaultStop = tpl?.stop ?? [];
                    tpl.stop = [...defaultStop, ...task.template.stop];
                }
                if (task.template?.system) {
                    tpl.replaceSystem(task.template.system)
                }
                if (task.template?.assistant) {
                    tpl.afterAssistant(task.template.assistant)
                }
                if (task.shots) {
                    task.shots.forEach((s) => tpl.addShot(s.user, s.assistant));
                }
                // check task variables
                if (task?.variables) {
                    if (task.variables?.required) {
                        for (const reqvar of task.variables.required) {
                            if (!(reqvar in tvars)) {
                                throw new Error(`The variable ${reqvar} is required to run this task`)
                            }
                        }
                    }
                    if (task.variables?.optional) {
                        for (const optvar of task.variables.optional) {
                            if (!(optvar in tvars)) {
                                task.prompt = task.prompt.replaceAll(`{${optvar}}`, "");
                            }
                        }
                    }
                }
                // apply variables
                for (const [k, v] of Object.entries(tvars)) {
                    task.prompt = task.prompt.replaceAll(`{${k}}`, v);
                }
                tpl.replacePrompt(task.prompt)
                const pr = tpl.prompt(prompt);
                //console.log("PR", pr);
                //console.log("PARAMS", task.inferParams)
                if (ex.lm.providerType == "ollama") {
                    // tell Ollama to apply no template
                    if (!task.inferParams?.extra) {
                        task.inferParams.extra = { "raw": true }
                    } else {
                        task.inferParams.extra["raw"] = true
                    }
                }
                const res = await ex.think(pr, { ...task.inferParams, stream: true });
                return res
            },
            abort: async (): Promise<void> => {
                const expert = this.brain.getExpertForModel(task.model.name);
                if (!expert) {
                    console.error(`Expert for model ${task.model.name} not found, can not abort`);
                    return
                }
                const ex = this.brain.expert(expert);
                await ex.abortThinking()
            }
        }
        return useAgentTask(ts)
    }
}

export { LmTaskBuilder }