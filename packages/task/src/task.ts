import { InferenceOptions, InferenceResult, ToolSpec } from '@locallm/types';
import { PromptTemplate } from 'modprompt';
import YAML from 'yaml';
import { Agent } from "../../agent/dist/agent.js";
import { formatInferParams } from './inferparams.js';
import { ModelSpec, TaskConf, TaskDef, TaskInput, TaskOutput } from "./interfaces.js";
import { formatTaskTemplate } from './templates.js';
import { applyVariables } from './variables.js';

class Task {
    def: TaskDef;
    agent: Agent;

    constructor(agent: Agent, def: TaskDef) {
        this.agent = agent;
        this.def = def;
    }

    static fromYaml(agent: Agent, txt: string) {
        const data = YAML.parse(txt);
        return new Task(agent, data as TaskDef)
    }

    async run(
        params: TaskInput, conf?: TaskConf
    ): Promise<TaskOutput> {
        //console.log("P", params);
        //console.log("TOOLS", this.agent.tools);
        if (!params?.prompt) {
            throw new Error("Please provide a prompt parameter");
        }
        let model = this.def.model;
        let ctx = this.def.ctx;
        const useTemplates = this.agent.lm.providerType !== "openai";
        if (conf) {
            if (conf?.model) {
                model = conf.model;
                if (model?.ctx) {
                    ctx = model.ctx;
                }
            }
            if (conf?.modelname) {
                let found = false;
                if (this.def?.models) {
                    for (const [modelName, _mod] of Object.entries(this.def.models)) {
                        if (modelName == conf.modelname) {
                            found = true;
                            const m = _mod as ModelSpec;
                            if (m?.ctx) {
                                ctx = m.ctx
                            }
                            model = m;
                            break;
                        }
                    }
                }
                if (!found) {
                    if (this.agent.lm.providerType == "ollama") {
                        model = { name: conf.modelname }
                    } else {
                        throw new Error(`No model found for ${conf.modelname}. Available models:\n${params?.models}`)
                    }
                }
            }
        }
        if (this.agent.lm.providerType == "ollama") {
            await this.agent.lm.loadModel(model.name, ctx);
        }
        this.def = applyVariables(this.def, params);
        let tpl: PromptTemplate = new PromptTemplate("none");
        let finalPrompt: string;
        const options: InferenceOptions = {};
        const agentToolsList = Object.values(this.agent.tools);
        if (useTemplates) {
            tpl = formatTaskTemplate(this.def, model?.template ? model.template : undefined);
            this.def.inferParams = formatInferParams(this.def.inferParams ?? {}, conf ?? {}, tpl);
            tpl.replacePrompt(this.def.prompt);
            if (agentToolsList.length > 0) {
                if (!tpl?.toolsDef) {
                    throw new Error(`The template ${tpl.name} does not have tools and the task ${this.def.name} specifies some`)
                }
                agentToolsList.forEach((t) => tpl.addTool(t));
            };
            finalPrompt = tpl.prompt(params.prompt);
        } else {
            this.def.inferParams = formatInferParams(this.def.inferParams ?? {}, conf ?? {});
            finalPrompt = this.def.prompt.replace("{prompt}", params.prompt);
        }
        if (agentToolsList.length > 0) {
            options.tools = agentToolsList;
        }
        if (conf?.debug) {
            console.log("-----------", model.name, "- Template:", tpl.name, "- Ctx:", ctx, "-----------");
            console.log(finalPrompt);
            console.log("----------------------------------------------")
            console.log("Infer params:", this.def.inferParams);
            console.log("----------------------------------------------")
        }
        if (this.agent.lm.providerType == "ollama") {
            if (!this.def.inferParams?.extra) {
                this.def.inferParams["extra"] = {}
            }
            // tell Ollama to apply no template
            this.def.inferParams["extra"]["raw"] = true
        }
        let answer: InferenceResult;
        if (!useTemplates) {
            if (this.def.template?.system) {
                options.system = this.def.template.system;
            }
            if (this.def?.shots) {
                options.history = this.def.shots;
            }
            answer = await this.agent.run(finalPrompt, this.def.inferParams, options);
        } else {
            answer = await this.agent.run(finalPrompt, this.def.inferParams, options, tpl);
        }
        return { answer: answer, errors: {}, template: useTemplates ? tpl : undefined }
    }

    addTools(tools: Array<ToolSpec>): Task {
        tools.forEach(t => this.agent.tools[t.name] = t);
        return this
    }
}

export {
    Task
};
