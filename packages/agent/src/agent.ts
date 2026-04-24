import { Lm } from "./client.js";
import type { InferenceParams, ToolSpec, HistoryTurn, InferenceOptions, InferenceResult, ToolTurn } from "@agent-smith/types";

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
    ): Promise<InferenceResult> {
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
        this.tools = {};
        if (options?.tools) {
            options.tools.forEach(t => {
                this.tools[t.name] = t;
            });
        }
        return await this.runAgent(1, prompt, params, options)
    }

    async runAgent(
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
        if (_res.thinkingText.length > 0) {
            if (options?.onThink) {
                options.onThink(_res.thinkingText)
            }
        }
        if (_res.text.length > 0) {
            if (options?.onAssistant) {
                options.onAssistant(_res.text)
            }
        }
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
                    thinkingText: "",
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
            _res = await this.runAgent(nit, "", params, options);
        } else {
            this.history.push({ assistant: res.text });
            if (options?.onTurnEnd) {
                options.onTurnEnd(this.history[this.history.length - 1])
            }
        }
        return _res
    }
}

export {
    Agent,
}

