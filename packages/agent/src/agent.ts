import { Lm } from "@locallm/api";
import { InferenceParams, ToolSpec, HistoryTurn, InferenceOptions, InferenceResult, ToolTurn } from "@locallm/types";
import { PromptTemplate } from 'modprompt';
import { splitThinking } from "./utils.js";

class Agent {
    name: string = "unamed";
    lm: Lm;
    tools: Record<string, ToolSpec> = {};
    history: Array<HistoryTurn> = [];

    constructor(lm: Lm, name?: string) {
        this.lm = lm;
        if (name) {
            this.name = name
        }
    }

    async run(
        prompt: string,
        params: InferenceParams,
        options: InferenceOptions = {},
        template?: PromptTemplate | string,
    ): Promise<InferenceResult> {
        let tpl: PromptTemplate;
        if (options?.debug) {
            console.log("Agent", this.name, "inference params:", params);
            console.log("Agent", this.name, "options:", options);
            //console.log("Agent template:", template);
            //console.log("Agent prompt:", prompt);
        }
        if (options?.history) {
            this.history = options.history;
            options.history = undefined;
        }
        if (this.lm.providerType == "openai") {
            // update tools
            this.tools = {};
            if (options?.tools) {
                options.tools.forEach(t => {
                    this.tools[t.name] = t;
                });
            }
            const res = await this.runAgentNoTemplate(1, prompt, params, options)
            return res
        } else {
            if (!template) {
                if (params?.template) {
                    tpl = new PromptTemplate(params.template);
                } else {
                    throw new Error(`A template is required for provider ${this.lm.provider.name}`)
                }
            } else {
                if (typeof template == "string") {
                    tpl = new PromptTemplate(template);
                } else {
                    tpl = template
                }
            }
            // update tools
            this.tools = {};
            if (options?.tools) {
                options.tools.forEach(t => {
                    this.tools[t.name] = t;
                    tpl = tpl.addTool(t)
                });
            }
            const res = await this.runAgentWithTemplate(1, prompt, params, options, tpl);
            //console.log("AGENT: RES NO TPL:", res);
            return res
        }
    }

    async runAgentNoTemplate(
        it: number,
        prompt: string,
        params: InferenceParams,
        options: InferenceOptions = {},
    ) {
        //console.log("AGENT PROMPT NO TPL", prompt);
        //console.log("(AGENT) RUN NO TEMPLATE params:", JSON.stringify(params, null, 2));
        //console.log("(AGENT) RUN NO TEMPLATE options:", JSON.stringify(options, null, 2));
        //console.log("(AGENT) RUN NO TEMPLATE provider:", this.lm.providerType);
        options.history = this.history;
        const res = await this.lm.infer(prompt, params, options);
        //console.log("(AGENT) RUN RES:");
        //console.dir(res, {depth: 8})
        if (it == 1) {
            this.history.push({ user: prompt });
        }
        let _res = res;
        //console.log("RES", res);
        if (res?.toolCalls) {
            if (options?.onToolsTurnStart) {
                options.onToolsTurnStart(res.toolCalls);
            }
            const toolsResults = new Array<ToolTurn>();
            const toolNames = Object.keys(this.tools);
            for (const tc of res.toolCalls) {
                if (!toolNames.includes(tc.name)) {
                    throw new Error(`Inexistant tool ${tc.name} called (available tools: ${toolNames})`)
                }
                const tool = this.tools[tc.name];
                let canRun = true;
                if (tool?.canRun) {
                    canRun = await tool.canRun(tc);
                }
                //console.log(tool.name, "can run:", canRun)
                if (canRun) {
                    if (options?.onToolCall) {
                        options.onToolCall(tc);
                    }
                    const toolCallResult = await tool.execute(tc.arguments);
                    if (options?.debug || options?.verbose) {
                        console.log("[x] Executed tool", tool.name + ":", toolCallResult);
                    }
                    toolsResults.push({ call: tc, response: JSON.stringify(toolCallResult) });
                    if (options?.onToolCallEnd) {
                        options.onToolCallEnd(tc.id, toolCallResult);
                    }
                } else {
                    if (options?.debug || options?.verbose) {
                        console.log("[-] Tool", tool.name, "execution refused");
                    }
                }
            }
            if (options?.onToolsTurnEnd) {
                options.onToolsTurnEnd(toolsResults);
            }
            this.history.push({ tools: toolsResults });
            if (options?.isToolsRouter) {
                const fres: InferenceResult = {
                    text: JSON.stringify(toolsResults.map(tr => tr.response)),
                    stats: res.stats,
                    serverStats: res.serverStats,
                    toolCalls: res.toolCalls,
                }
                return fres
            }
            const nit = it + 1;
            /*if (nit > 1 && options?.debug) {
                options.debug = false;
                options.verbose = true;
            }*/
            //console.log("HISTORY:");
            //console.dir(options.history, {depth: 8});         
            if (options?.tools) {
                options.tools = Object.values(this.tools);
            }
            if (options?.onTurnEnd) {
                options.onTurnEnd(this.history[this.history.length - 1])
            }
            _res = await this.runAgentNoTemplate(nit, "", params, options);
        } else {
            this.history.push({ assistant: res.text });
            if (options?.onTurnEnd) {
                options.onTurnEnd(this.history[this.history.length - 1])
            }
        }
        return _res
    }

    async runAgentWithTemplate(
        it: number,
        prompt: string,
        params: InferenceParams,
        options: InferenceOptions = {},
        tpl: PromptTemplate,
    ): Promise<InferenceResult> {
        if (this.lm.providerType == "ollama") {
            if (!params?.model) {
                throw new Error("A model inference parameters is required for provider Ollama")
            }
            await this.lm.loadModel(params.model.name, params.model.ctx);
        }
        tpl.history = this.history;
        //console.log("TPL", tpl);
        //console.log("TPL HIST", tpl.history);
        //console.log("Agent template raw prompt:", prompt);
        //console.log("Agent template options", options);
        //console.log(it, this.name, `${options.isToolsRouter ? "tools router " : ""}agent (template) tools`, this.tools);
        const pr = tpl.prompt(prompt);
        //console.log(it, "agent template tpl prompt:", pr);
        //console.log("Agent no template tpl render:", tpl.render());
        let res = await this.lm.infer(pr, params, options);
        if (typeof params?.model == "string") {
            params.model = { name: params.model }
        }
        const { isToolCall, toolsCall, assistant, error } = tpl.processAnswer(res.text);
        if (error) {
            throw new Error(`error processing model answer:\n, ${error}`);
        }
        if (assistant) {
            if (options?.onAssistant) {
                options.onAssistant(assistant)
            }
        }
        //console.log("\nProcessed answer", isToolCall, toolsCall, error);
        //const toolsUsed: Record<string, ToolTurn> = {};
        const toolResults = new Array<ToolTurn>();
        if (isToolCall) {
            if (options?.onToolsTurnStart) {
                options.onToolsTurnStart(toolsCall);
            }
            for (const toolCall of toolsCall) {
                // get the tool
                if (!("name" in toolCall)) {
                    throw new Error(`tool call does not includes a name in it's response:\n${toolCall}`);
                }
                if (!("arguments" in toolCall)) {
                    toolCall.arguments = {};
                    //throw new Error(`tool call does not includes arguments in it's response:\n${toolCall}`);
                }
                //const tool = this.tools.find((t) => t.name === toolCall.name);
                toolCall.name = toolCall.name.trim();
                const tool = toolCall.name in this.tools ? this.tools[toolCall.name] : null;
                if (!tool) {
                    const buf = new Array<string>(
                        `wrong tool call ${toolCall.name} from the model:`,
                        JSON.stringify(toolCall, null, "  "),
                        `It does not exist in the tools list:. Available tools:`,
                        JSON.stringify(Object.keys(this.tools), null, "  "),
                    );
                    throw new Error(buf.join("\n"));
                }
                let canRun = true;
                //console.log("CAN RUN", tool?.canRun);
                if (tool?.canRun) {
                    //console.log("WAIT TOOL CONFIRM");
                    canRun = await tool.canRun(toolCall);
                }
                if (!canRun) {
                    if (options?.debug || options?.verbose) {
                        console.log("[-] Tool", tool.name, "execution refused");
                    }
                    const toolResp = "tool execution denied";
                    toolResults.push({
                        call: toolCall,
                        response: toolResp,
                    });
                    if (options?.onToolCallEnd) {
                        options.onToolCallEnd(toolCall.id, toolResp);
                    }
                } else {
                    if (options?.onToolCall) {
                        options.onToolCall(toolCall);
                    }
                    // execute tool                
                    if (options?.debug === true) {
                        console.log("\n=> Calling tool", tool.name + ":", toolCall.arguments);
                    }
                    const toolResp = await tool.execute(toolCall.arguments);
                    if (options?.debug) {
                        console.log("[x] Executed tool", tool.name + ":", toolResp);
                    }
                    toolResults.push({
                        call: toolCall,
                        response: toolResp
                    });
                    //console.log("ONTCE")
                    if (options?.onToolCallEnd) {
                        options.onToolCallEnd(toolCall.id, toolResp);
                    }
                }
            }
            if (options?.onToolsTurnEnd) {
                options.onToolsTurnEnd(toolResults);
            }
            if (it == 1) {
                //console.log("PROMPT HIST", prompt);
                const t: HistoryTurn = {
                    user: prompt,
                    tools: toolResults,
                };
                if (assistant) {
                    t.assistant = assistant
                }
                this.history.push(t);
            } else {
                const t: HistoryTurn = {
                    tools: toolResults,
                };
                if (assistant) {
                    t.assistant = assistant
                }
                this.history.push(t);
            }
            if (options?.isToolsRouter && isToolCall) {
                const fres: InferenceResult = {
                    text: JSON.stringify(toolResults.map(tr => tr.response)),
                    stats: res.stats,
                    serverStats: res.serverStats,
                    toolCalls: res.toolCalls,
                }
                return fres
            }
            if (options?.onTurnEnd) {
                options.onTurnEnd(this.history[this.history.length - 1])
            }
            return await this.runAgentWithTemplate(it + 1, prompt, params, options, tpl)
        } else {
            let thinking = "";
            let final = res.text;
            if (tpl?.tags?.think) {
                const { think, finalAnswer } = splitThinking(res.text, tpl.tags.think.start, tpl.tags.think.end);
                thinking = think;
                final = finalAnswer;
            }
            if (it == 1) {
                const turn: HistoryTurn = {};
                if (thinking.length > 0) {
                    turn.think = thinking
                }
                turn.user = prompt.replace("{prompt}", prompt);
                turn.assistant = final;
                this.history.push(turn)
            } else {
                const turn: HistoryTurn = {};
                if (thinking.length > 0) {
                    turn.think = thinking
                }
                turn.assistant = final;
                this.history.push(turn)
            }
            if (options?.onTurnEnd) {
                options.onTurnEnd(this.history[this.history.length - 1])
            }
            return res
        }
    }

    async abort() {
        this.lm.abort()
    }
}

export {
    Agent,
}

