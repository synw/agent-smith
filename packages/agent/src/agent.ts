import { Lm } from "@locallm/api";
import { InferenceParams, ToolSpec, HistoryTurn, InferenceOptions, InferenceResult, ToolTurn } from "@locallm/types";
import { PromptTemplate } from 'modprompt';
import { splitThinking } from "./utils.js";

class Agent {
    lm: Lm;
    tools: Record<string, ToolSpec> = {};
    history: Array<HistoryTurn> = [];

    constructor(lm: Lm) {
        this.lm = lm;
    }

    async run(
        prompt: string,
        params: InferenceParams,
        options: InferenceOptions = {},
        template?: PromptTemplate | string,
    ): Promise<{ result: InferenceResult, template: PromptTemplate }> {
        let tpl: PromptTemplate;
        if (options?.debug) {
            console.log("Agent inference params:", params);
            console.log("Agent options:", options);
            //console.log("Agent template:", template);
            //console.log("Prompt:", prompt);
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
            return { result: res, template: new PromptTemplate("none") }
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
            return (await this.runAgentWithTemplate(1, prompt, params, options, tpl));
        }
    }

    async runAgentNoTemplate(
        it: number,
        prompt: string,
        params: InferenceParams,
        options: InferenceOptions = {},
    ) {
        /*/console.log("(AGENT) RUN NO TEMPLATE params:", JSON.stringify(params,null,2));
        console.log("(AGENT) RUN NO TEMPLATE options:", JSON.stringify(options,null,2));
        console.log("(AGENT) RUN NO TEMPLATE provider:", this.lm.providerType);*/
        const res = await this.lm.infer(prompt, params, options);
        //console.log("(AGENT) RUN RES:");
        //console.dir(res, {depth: 8})
        this.history.push({ user: prompt });
        let _res = res;
        //console.log("RES", res);
        if (res?.toolCalls) {
            const toolsResults = new Array<ToolTurn>();
            const toolNames = Object.keys(this.tools);
            for (const tc of res.toolCalls) {
                if (!toolNames.includes(tc.name)) {
                    throw new Error(`Inexistant tool ${tc.name} called (available tools: ${toolNames})`)
                }
                const tool = this.tools[tc.name];
                let canRun = true;
                if (tool?.canRun) {
                    canRun = await tool.canRun(tool);
                }
                //console.log(tool.name, "can run:", canRun)
                if (canRun) {
                    const toolCallResult = await tool.execute(tc.arguments);
                    if (options?.debug || options?.verbose) {
                        console.log("[x] Executed tool", tool.name + ":", toolCallResult);
                    }
                    toolsResults.push({ call: tc, response: toolCallResult });
                } else {
                    if (options?.debug || options?.verbose) {
                        console.log("[-] Tool", tool.name, "execution refused");
                    }
                }
            }
            this.history.push({ tools: toolsResults });
            if (options?.tools) {
                options.tools = Object.values(this.tools);
            }
            const nit = it + 1;
            if (nit > 1 && options?.debug) {
                options.debug = false;
                options.verbose = true;
            }
            options.history = this.history;
            //console.log("HISTORY:");
            //console.dir(options.history, {depth: 8});
            _res = await this.runAgentNoTemplate(nit, " ", params, options);
        } else {
            this.history.push({ assistant: res.text });
        }
        return _res
    }

    async runAgentWithTemplate(
        it: number,
        prompt: string,
        params: InferenceParams,
        options: InferenceOptions = {},
        tpl: PromptTemplate,
    ): Promise<{ result: InferenceResult, template: PromptTemplate }> {
        if (this.lm.providerType == "ollama") {
            if (!params?.model) {
                throw new Error("A model inference parameters is required for provider Ollama")
            }
            await this.lm.loadModel(params.model.name, params.model.ctx);
        }
        //console.log("Agent params:", params);
        let res = await this.lm.infer(tpl.prompt(prompt), params, options);
        if (typeof params?.model == "string") {
            params.model = { name: params.model }
        }
        //console.log("Agent params AFTER CALL:", params);
        const { isToolCall, toolsCall, error } = tpl.processAnswer(res.text);
        if (error) {
            throw new Error(`error processing tool call answer:\n, ${error}`);
        }
        //console.log("\nProcessed answer", isToolCall, toolsCall, error);
        //const toolsUsed: Record<string, ToolTurn> = {};
        const toolResults = new Array<ToolTurn>();
        if (isToolCall) {
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
                // execute tool
                if (options?.debug === true) {
                    console.log("\n* Calling tool", tool.name + ":", toolCall.arguments);
                }
                const toolResp = await tool.execute(toolCall.arguments);
                if (options?.debug || options?.verbose) {
                    console.log("[x] Executed tool", tool.name + ":", toolResp);
                }
                toolResults.push({
                    call: toolCall,
                    response: toolResp
                });
            }
            if (it == 1) {
                tpl.pushToHistory({
                    user: prompt.replace("{prompt}", prompt),
                    assistant: res.text,
                    tools: toolResults,
                });
            } else {
                tpl.pushToHistory({
                    assistant: res.text,
                    tools: toolResults,
                });
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
                if (thinking.length > 0) {
                    tpl.pushToHistory({ think: thinking })
                }
                tpl.pushToHistory({
                    user: prompt.replace("{prompt}", prompt),
                    assistant: final,
                });
            } else {
                if (thinking.length > 0) {
                    tpl.pushToHistory({ think: thinking })
                }
                tpl.pushToHistory({
                    assistant: final,
                });
            }
            this.history = tpl.history;
            return { result: res, template: tpl }
        }
    }

    async abort() {
        this.lm.abort()
    }
}

export {
    Agent,
}

