import { Lm } from "./client.js";
import type { InferenceParams, ToolSpec, HistoryTurn, InferenceOptions, InferenceResult, ToolTurn, AgentParams, ToolCallSpec } from "@agent-smith/types";

class Agent {
    name: string = "unamed";
    lm: Lm;
    tools: Record<string, ToolSpec> = {};
    history: Array<HistoryTurn> = [];
    onToolCall?: (tc: ToolCallSpec) => void;
    onToolCallEnd?: (id: string, tr: any) => void;
    onToolsTurnStart?: (tc: Array<ToolCallSpec>) => void;
    onToolsTurnEnd?: (tt: Array<ToolTurn>) => void;
    onTurnEnd?: (ht: HistoryTurn) => void;
    onAssistant?: (txt: string) => void;
    onThink?: (txt: string) => void;

    constructor(params: AgentParams) {
        this.lm = params.lm;
        if (params?.name) {
            this.name = params.name;
        }
        // lm params
        if (params?.onToken) {
            this.lm.onToken = params.onToken;
        }
        if (params?.onThinkingToken) {
            this.lm.onThinkingToken = params.onThinkingToken;
        }
        if (params?.onStartEmit) {
            this.lm.onStartEmit = params.onStartEmit;
        }
        if (params?.onEndEmit) {
            this.lm.onEndEmit = params.onEndEmit;
        }
        if (params?.onError) {
            this.lm.onError = params.onError;
        }
        if (params?.onToolCallInProgress) {
            this.lm.onToolCallInProgress = params.onToolCallInProgress;
        }
        // agent params
        this.onToolCall = params?.onToolCall;
        this.onToolCallEnd = params?.onToolCallEnd;
        this.onToolsTurnStart = params?.onToolsTurnStart;
        this.onToolsTurnEnd = params?.onToolsTurnEnd;
        this.onTurnEnd = params?.onTurnEnd;
        this.onAssistant = params?.onAssistant;
        this.onThink = params?.onThink;
    }

    async run(
        prompt: string,
        options: InferenceOptions = {},
    ): Promise<InferenceResult> {
        if (options?.debug) {
            console.log("Agent", this.name, "inference params:", options?.params);
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
        return await this.runAgent(1, prompt, options)
    }

    async runAgent(
        it: number,
        prompt: string,
        options: InferenceOptions = {},
    ) {
        //console.log("AGENT PROMPT NO TPL", prompt);
        //console.log("(AGENT) RUN NO TEMPLATE params:", JSON.stringify(params, null, 2));
        //console.log("(AGENT) RUN NO TEMPLATE options:", JSON.stringify(options, null, 2));
        //console.log("(AGENT) RUN NO TEMPLATE provider:", this.lm.providerType);
        options.history = this.history;
        const res = await this.lm.infer(prompt, options);
        //console.log("(AGENT) RUN RES:");
        //console.dir(res, {depth: 8})
        if (it == 1) {
            this.history.push({ user: prompt });
        }
        let _res = res;
        //console.log("RES", res);
        if (_res.thinkingText.length > 0) {
            if (this?.onThink) {
                this.onThink(_res.thinkingText)
            }
        }
        if (_res.text.length > 0) {
            if (this?.onAssistant) {
                this.onAssistant(_res.text)
            }
        }
        if (res?.toolCalls) {
            if (this?.onToolsTurnStart) {
                this.onToolsTurnStart(res.toolCalls);
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
                    if (this?.onToolCall) {
                        this.onToolCall(tc);
                    }
                    const toolCallResult = await tool.execute(tc.arguments);
                    if (options?.debug || options?.verbose) {
                        console.log("[x] Executed tool", tool.name + ":", toolCallResult);
                    }
                    toolsResults.push({ call: tc, response: JSON.stringify(toolCallResult) });
                    if (this?.onToolCallEnd) {
                        this.onToolCallEnd(tc.id, toolCallResult);
                    }
                } else {
                    if (options?.debug || options?.verbose) {
                        console.log("[-] Tool", tool.name, "execution refused");
                    }
                }
            }
            if (this?.onToolsTurnEnd) {
                this.onToolsTurnEnd(toolsResults);
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
            if (this?.onTurnEnd) {
                this.onTurnEnd(this.history[this.history.length - 1])
            }
            _res = await this.runAgent(nit, "", options);
        } else {
            this.history.push({ assistant: res.text });
            if (this?.onTurnEnd) {
                this.onTurnEnd(this.history[this.history.length - 1])
            }
        }
        return _res
    }
}

export {
    Agent,
}

