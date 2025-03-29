import YAML from 'yaml';
import { AgentBrain, LmExpert } from "@agent-smith/brain";
import { AgentTask, AgentTaskSpec, useAgentTask } from "@agent-smith/jobs";
import { PromptTemplate } from "modprompt";
import { useTemplateForModel } from "@agent-smith/tfm";
import { LmTask, LmTaskConf, LmTaskInput, LmTaskOutput, ModelSpec } from "./interfaces.js";
import { InferenceResult } from '@locallm/types';

const tfm = useTemplateForModel();

class LmTaskBuilder<T = string, P extends Record<string, any> = Record<string, any>> {
    brain: AgentBrain<P>;
    expert: LmExpert<P> | null = null;

    constructor(agentBrain: AgentBrain<P>) {
        this.brain = agentBrain;
    }

    readFromYaml(txt: string): LmTask {
        const data = YAML.parse(txt);
        return data
    }

    fromYaml(txt: string, type?: T, autoCreateExpert = true): AgentTask<T, LmTaskInput, LmTaskOutput, P> {
        const data = YAML.parse(txt);
        return this.init(data, type, autoCreateExpert);
    }

    init(task: LmTask, type?: T, autoCreateExpert = true): AgentTask<T, LmTaskInput, LmTaskOutput, P> {
        const ts: AgentTaskSpec<T, LmTaskInput, LmTaskOutput, P> = {
            id: task.name,
            title: task.description,
            type: type,
            run: async (
                params: LmTaskInput, conf?: LmTaskConf<P>
            ): Promise<LmTaskOutput> => {
                //console.log("Conf", conf?.expert?.model);
                if (!params?.prompt) {
                    throw new Error("Please provide a prompt parameter");
                }
                let prompt = params.prompt;
                const tvars = params as Record<string, any>;
                delete tvars.prompt;
                let overrideModel = false;
                if (conf) {
                    if (conf?.model) {
                        //console.log("CONF MOD", conf.model);
                        overrideModel = true;
                        task.model = conf.model;
                        if (!task.model?.template) {
                            // try to guess the template
                            const gt = tfm.guess(conf.model.name);
                            if (gt == "none") {
                                throw new Error(`Unable to guess the template for ${conf.model}: please provide a template name: m="modelname/templatename"`)
                            }
                            task.model.template = gt;
                        }
                        //console.log("MO", modelOverride);
                    }
                }
                if (!overrideModel) {
                    if (conf?.size) {
                        let found = false;
                        if (params?.models) {
                            for (const [size, _mod] of Object.entries(params.models)) {
                                if (size == conf.size) {
                                    found = true;
                                    const m = _mod as ModelSpec;
                                    task.model = m;
                                    break;
                                }
                            }
                        }
                        if (!found) {
                            throw new Error(`No model found for ${conf.size}`)
                        }
                    }
                }
                if (conf) {
                    if ("expert" in conf) {
                        this.expert = conf.expert as LmExpert<P>;
                    } else {
                        if (!this.expert) {
                            // try to find an existing expert for the model
                            this.expert = this.brain.getExpertForModel(task.model.name);
                            //console.log("FIND", this.expert);
                            if (autoCreateExpert && !this.expert) {
                                // try to find an existing expert for the model or create it
                                this.expert = this.brain.getOrCreateExpertForModel(task.model.name, task.model.template);
                                //console.log("AUTO", this.expert);
                            }
                        }
                    }
                }
                if (!this.expert) {
                    //return { error: `Expert for model ${modelName} not found` }
                    throw new Error(`Expert for model ${task.model.name} not found: no backend is available for this model`)
                }
                //console.log("TASK EXPERT", this.expert.name);
                //const ex = this.brain.expert(expert);
                //const errors: Record<string, any> = {};
                if (this.expert.lm.providerType == "ollama") {
                    if (this.expert.lm.model.name != task.model.name) {
                        //console.log("Loading model", task.model.name, task.model.ctx);
                        await this.expert.lm.loadModel(task.model.name, task.model.ctx);
                    }
                } else if (this.expert.lm.model.name != task.model.name) {
                    const err = `The ${task.model.name} model is not loaded on server (currently ${this.expert.lm.model.name})`;
                    throw new Error(err)
                }
                const tpl = new PromptTemplate(task.model.template);
                const ip = task?.inferParams ? task.inferParams as Record<string, any> : {};
                if (task?.inferParams) {
                    task.inferParams.stop = tpl?.stop ?? [];
                }
                if (task?.template) {
                    if (task.template?.system) {
                        tpl.replaceSystem(task.template.system)
                    }
                    if (task.template?.assistant) {
                        tpl.afterAssistant(" " + task.template.assistant)
                    }
                    if (task.template?.stop) {
                        if (!ip?.stop) {
                            ip.stop = []
                        }
                        ip.stop.push(...task.template.stop);
                    }
                }
                if (task?.shots) {
                    task.shots.forEach((s) => {
                        //console.log("** SHOT", s);
                        tpl.addShot(s.user, s.assistant)
                    });
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
                tpl.replacePrompt(task.prompt);
                // apply tools
                //console.log("TASKT", task?.tools);
                if (task?.tools) {
                    if (!tpl?.toolsDef) {
                        throw new Error(`The template ${tpl.name} does not have tools and the task ${task.name} specifies some`)
                    }
                    task.tools.forEach((t) => {
                        tpl.addTool(t)
                    })
                };
                const pr = tpl.prompt(prompt);
                if (conf?.debug) {
                    console.log("-----------", task.model.name, "/", task.model.template, "-----------");
                    console.log(pr);
                    console.log("----------------------------------------------")
                }
                if (conf?.debug) {
                    console.log("Infer params:", task.inferParams);
                    console.log("----------------------------------------------")
                }
                if (this.expert.lm.providerType == "ollama") {
                    // tell Ollama to apply no template
                    if (!task?.inferParams?.extra) {
                        ip["extra"] = { "raw": true }
                    } else {
                        ip["extra"]["raw"] = true
                    }
                }
                // override infer params
                if (conf?.inferParams) {
                    for (const [k, v] of Object.entries(conf.inferParams)) {
                        ip[k] = v
                    }
                }
                //console.log("THINK")
                let answer = await this.expert.think(pr, { ...ip, stream: true }, { skipTemplate: true });
                // process with tools
                let toolUsed: string | null = null;
                //console.log("TASK TOOLS", task.tools);
                if (task?.tools) {
                    const toolResponseStart = tpl.toolsDef?.response.split("{tools_response}")[0];
                    const toolCallStart = tpl.toolsDef?.response.split("{tool}")[0];
                    if (!toolCallStart || !toolResponseStart) {
                        throw new Error(`Tool definition malformed in template ${tpl.name} (executing task ${task.name})`)
                    }
                    const { isToolCall, toolsCall, error } = tpl.processAnswer(answer.text);
                    if (error) {
                        throw new Error(`Error processing tool call answer:\n, ${answer}`);
                    }
                    //console.log("\nProcessed answer", isToolCall, toolsCall, error);
                    if (isToolCall) {
                        //if (conf?.debug) {console.log("LMC", conf);}
                        // 1. find the which tool
                        //const tres = tpl.tools.find((t) => t.name == "")
                        let toolsResponses = new Array<string>();
                        let errMsg = "";
                        for (const toolCall of toolsCall) {
                            // get the tool
                            if (!("name" in toolCall)) {
                                errMsg = `tool call does not includes a name in it's response:\n${toolCall}`;
                                continue
                            }
                            if (!("arguments" in toolCall)) {
                                errMsg = `tool call does not includes a name in it's response:\n${toolCall}`;
                                continue
                            }
                            const tool = task.tools.find((t) => t.name === toolCall.name);
                            if (!tool) {
                                errMsg = `wrong tool call ${task.name} from the model: it does not exist in ${tpl.name}:\n${toolCall}`;
                                continue
                            }
                            // execute tool
                            if (conf?.debug) {
                                console.log("Calling tool", toolCall.name, "with arguments", toolCall.arguments);
                            }
                            const toolResp = await tool.execute(toolCall.name, toolCall.arguments);
                            // process tool response
                            const resp = tpl.encodeToolResponse(toolResp);
                            toolsResponses.push(resp);
                            toolUsed = toolCall.name;
                        }
                        if (!errMsg) {
                            let toolsRespMsg = "";
                            if (toolsResponses.length == 1) {
                                toolsRespMsg = toolsResponses[0];
                            } else {
                                toolsRespMsg = JSON.stringify(toolsResponses);
                            }
                            tpl.pushToHistory({
                                user: prompt,
                                assistant: answer.text,
                                tool: toolsRespMsg,
                            });
                            answer = await this.expert.think(tpl.prompt(pr), { ...ip, stream: true }, { skipTemplate: true });
                        } else {
                            throw new Error(errMsg)
                        }
                    }
                }
                return { answer: answer, toolUsed: toolUsed, errors: {} }
            },
            abort: async (): Promise<void> => {
                if (!this.expert) {
                    console.error(`Expert for model ${task.model.name} not found, can not abort`);
                    return
                }
                await this.expert.abortThinking()
            }
        }
        return useAgentTask<T, LmTaskInput, LmTaskOutput, P>(ts)
    }
}

export { LmTaskBuilder }