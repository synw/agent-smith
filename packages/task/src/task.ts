import { Agent } from "@agent-smith/agent";
import { InferenceOptions, InferenceResult } from '@locallm/types';
import { PromptTemplate } from 'modprompt';
import YAML from 'yaml';
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
        //console.log("TASK DEF", this.def);
        //console.log("TASK CONF", conf);
        //console.log("TOOLS", this.agent.tools);
        if (!params?.prompt) {
            throw new Error(`Task ${this.def.name}: no prompt parameter provided. Parameters: ${JSON.stringify(params, null, 2)}`);
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
        const options: InferenceOptions = {};
        if (conf?.onToolCall) {
            options.onToolCall = conf.onToolCall
        }
        if (conf?.onToolCallEnd) {
            options.onToolCallEnd = conf.onToolCallEnd
        }
        let hasTools = false;
        // add task tools to the agent
        if (this.def?.tools) {
            if (this.def?.tools.length > 0) {
                hasTools = true;
                this.def.tools.forEach(
                    t => {
                        this.agent.tools[t.name] = t;
                    }
                );
            }
        }
        if (useTemplates) {
            this.def.model = model;
            tpl = formatTaskTemplate(this.def, model?.template ? model.template : undefined);
            this.def.inferParams = formatInferParams(this.def.inferParams ?? {}, conf ?? {}, tpl);
            //tpl.replacePrompt(this.def.prompt);
            if (hasTools) {
                if (!tpl?.toolsDef) {
                    throw new Error(`The template ${tpl.name} does not have tools and the task ${this.def.name} specifies some`)
                }
                this.def.tools?.forEach((t) => tpl.addTool(t));
            };
            //finalPrompt = params.prompt;
        } else {
            this.def.inferParams = formatInferParams(this.def.inferParams ?? {}, conf ?? {});
        }
        //console.log("DEF", this.def);
        //console.log("P", params.prompt);
        const finalPrompt = this.def.prompt.replace("{prompt}", params.prompt);
        //console.log("FP", finalPrompt);
        // model
        if (model) {
            this.def.inferParams.model = model;
        }
        if (hasTools) {
            options.tools = this.def.tools;
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
        const isRoutingAgent = this.def.description.includes("routing agent");
        if (isRoutingAgent) {
            options.isToolsRouter = true
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
        // remove task tools from the agent
        if (hasTools) {
            this.def.tools?.forEach(
                t => {
                    delete this.agent.tools[t.name];
                }
            );
        }
        //console.log("TASK: ANSWER FINAL:", { answer: answer.result, errors: {}, template: answer.template })
        return { answer, template: tpl }
    }
}

export {
    Task
};
