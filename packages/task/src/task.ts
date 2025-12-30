import { InferenceOptions, InferenceResult, ToolSpec } from '@locallm/types';
import { PromptTemplate } from 'modprompt';
import YAML from 'yaml';
import { Agent } from "@agent-smith/agent";
import { formatInferParams } from './inferparams.js';
import { TaskConf, TaskDef, TaskInput, TaskOutput } from "./interfaces.js";
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
        //console.log("TASK CONF", conf);
        //console.log("TOOLS", this.agent.tools);
        if (!params?.prompt) {
            throw new Error(`Task ${this.def.name}: no prompt parameter provided. Parameters: ${params}`);
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
            /*else {
                throw new Error("No model found in task")
            }*/
        }
        //console.log("CONF", conf)
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
            //tpl.replacePrompt(this.def.prompt);
            if (agentToolsList.length > 0) {
                if (!tpl?.toolsDef) {
                    throw new Error(`The template ${tpl.name} does not have tools and the task ${this.def.name} specifies some`)
                }
                agentToolsList.forEach((t) => tpl.addTool(t));
            };
            finalPrompt = params.prompt;
        } else {
            this.def.inferParams = formatInferParams(this.def.inferParams ?? {}, conf ?? {});
            finalPrompt = this.def.prompt.replace("{prompt}", params.prompt);
        }
        // model
        if (model) {
            this.def.inferParams.model = model;
        }
        if (agentToolsList.length > 0) {
            options.tools = agentToolsList;
        }
        if (conf?.debug) {
            console.log("-----------", model.name, "- Template:", tpl.name, "- Ctx:", ctx, "-----------");
            console.log(useTemplates ? tpl.prompt(finalPrompt) : finalPrompt);
            console.log("----------------------------------------------")
            console.log("Infer params:", this.def.inferParams);
            console.log("----------------------------------------------")
            //options.debug = true
        }
        if (this.agent.lm.providerType == "ollama") {
            if (!this.def.inferParams?.extra) {
                this.def.inferParams["extra"] = {}
            }
            // tell Ollama to apply no template
            this.def.inferParams["extra"]["raw"] = true
        }
        let answer: InferenceResult;
        if (options?.debug) {
            // cut debug here. TODO: debug log levels
            options.debug = false
        }
        if (!useTemplates) {
            if (this.def.template?.system) {
                options.system = this.def.template.system;
            }
            if (this.def?.shots) {
                options.history = this.def.shots;
            }
            //console.log("RUN AGENT (TASK) params:", this.def.inferParams);
            //console.log("RUN AGENT (TASK) options:", options);
            answer = await this.agent.run(finalPrompt, this.def.inferParams, options);
        } else {
            //console.log("RUN AGENT (TASK) params:", this.def.inferParams);
            //console.log("RUN AGENT (TASK) options:", options);
            answer = await this.agent.run(finalPrompt, this.def.inferParams, options, tpl);
            tpl.history = this.agent.history;
            //console.log("RAW ANSWER", answer);
            //console.log("\nHISTORY", this.agent.history);
        }
        //console.log("TASK: ANSWER FINAL:", { answer: answer.result, errors: {}, template: answer.template })
        return { answer, template: tpl }
    }

    addTools(tools: Array<ToolSpec>): Task {
        tools.forEach(t => this.agent.tools[t.name] = t);
        return this
    }
}

export {
    Task
};
