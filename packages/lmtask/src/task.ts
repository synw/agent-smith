import YAML from 'yaml';
import { AgentBrain, LmExpert } from "@agent-smith/brain";
import { AgentTask, AgentTaskSpec, useAgentTask } from "@agent-smith/jobs";
//import { AgentTask, AgentTaskSpec, useAgentTask } from "../../jobs/src/main";
import { PromptTemplate } from "modprompt";
import { useTemplateForModel } from "@agent-smith/tfm";
import { LmTask } from "./interfaces.js";

const tfm = useTemplateForModel();

class LmTaskBuilder<T = string> {
    brain: AgentBrain;
    expert: LmExpert | null = null;

    constructor(agentBrain: AgentBrain) {
        this.brain = agentBrain;
    }

    readFromYaml(txt: string): LmTask {
        const data = YAML.parse(txt);
        return data
    }

    fromYaml(txt: string, type?: T, autoCreateExpert = true): AgentTask<T> {
        const data = YAML.parse(txt);
        return this.init(data, type, autoCreateExpert);
    }

    init(task: LmTask, type?: T, autoCreateExpert = true): AgentTask<T> {
        const ts: AgentTaskSpec<T> = {
            id: task.name,
            title: task.description,
            type: type,
            run: async (params: Record<string, any>, conf?: Record<string, any>) => {
                if (!params?.prompt) {
                    throw new Error("Please provide a prompt parameter");
                }
                let prompt = params.prompt;
                const tvars = params;
                delete tvars.prompt;
                let overrideModel = false;
                const modelOverride: { model: string, template: string | null } = {
                    model: "", template: null
                };
                if (conf) {
                    if (conf?.model) {
                        overrideModel = true;
                        modelOverride.model = conf.model;
                        if (conf?.template) {
                            modelOverride.template = conf.template;
                        } else {
                            // try to guess the template
                            const gt = tfm.guess(conf.model);
                            if (gt == "none") {
                                throw new Error(`Unable to guess the template for ${conf.model}: please provide a template name: m="modelname/templatename"`)
                            }
                            modelOverride.template = gt;
                        }
                        //console.log("MO", modelOverride);
                    }
                }
                //console.log("Running task", task.name, ", params:", params);
                //console.log("Prompt", prompt);
                //console.log("Vars", tvars);
                //console.log("Conf", conf);
                const modelName = overrideModel ? modelOverride.model : task.model.name;
                const templateName = modelOverride?.template ? modelOverride.template : task.template.name;
                if (conf) {
                    if ("expert" in conf) {
                        this.expert = conf.expert as LmExpert;
                    } else {
                        if (!this.expert) {
                            if (autoCreateExpert) {
                                // try to find an existing expert for the model or create it
                                this.expert = this.brain.getOrCreateExpertForModel(modelName, templateName);
                            }
                            // try to find an existing expert for the model
                            this.expert = this.brain.getExpertForModel(modelName);
                        }
                    }
                }
                if (!this.expert) {
                    //return { error: `Expert for model ${modelName} not found` }
                    throw new Error(`Expert for model ${modelName} not found: no backend is available for this model`)
                }
                //console.log("TASK EXPERT", this.expert.name);
                //const ex = this.brain.expert(expert);
                if (this.expert.lm.providerType == "ollama") {
                    if (this.expert.lm.model.name != modelName) {
                        await this.expert.lm.loadModel(modelName);
                    }
                } else if (this.expert.lm.model.name != modelName) {
                    throw new Error(`The ${modelName} model is not loaded on server (currently ${this.expert.lm.model.name})`)
                }
                const tpl = new PromptTemplate(templateName);
                task.inferParams.stop = tpl?.stop ?? [];
                if (task.template?.stop) {
                    task.inferParams.stop.push(...task.template.stop);
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
                if (conf?.debug) {
                    console.log("-----------", modelName, "/", templateName, "-----------");
                    console.log(pr);
                    console.log("----------------------------------------------")
                }
                //console.log("PARAMS", task.inferParams)
                if (this.expert.lm.providerType == "ollama") {
                    // tell Ollama to apply no template
                    if (!task.inferParams?.extra) {
                        task.inferParams.extra = { "raw": true }
                    } else {
                        task.inferParams.extra["raw"] = true
                    }
                }
                //console.log("THINK")
                const res = await this.expert.think(pr, { ...task.inferParams, stream: true });
                return res
            },
            abort: async (): Promise<void> => {
                if (!this.expert) {
                    console.error(`Expert for model ${task.model.name} not found, can not abort`);
                    return
                }
                await this.expert.abortThinking()
            }
        }
        return useAgentTask(ts)
    }
}

export { LmTaskBuilder }