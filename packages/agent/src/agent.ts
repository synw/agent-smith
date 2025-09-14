import { Lm } from "@locallm/api";
import { InferenceParams, ToolSpec, HistoryTurn, InferenceOptions, InferenceResult, ToolTurn } from "@locallm/types";
import { PromptTemplate } from 'modprompt';

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
        template?: PromptTemplate,
    ): Promise<InferenceResult> {
        // update tools
        this.tools = {};
        if (options?.tools) {
            options.tools.forEach(t => {
                this.tools[t.name] = t;
                if (template) {
                    template = template.addTool(t)
                }
            });
        }
        if (this.lm.providerType == "openai") {
            return await this.runAgentNoTemplate(1, prompt, params, options)
        } else {
            if (!template) {
                throw new Error(`A template is required for provider ${this.lm.provider.name}`)
            }
            return (await this.runAgentWithTemplate(1, prompt, params, options, template)).inferenceResult;
        }
    }

    async runAgentNoTemplate(
        it: number,
        prompt: string,
        params: InferenceParams,
        options: InferenceOptions = {},
    ) {
        const res = await this.lm.infer(prompt, params, options);
        this.history.push({ user: prompt });
        let _res = res;
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
    ): Promise<{ inferenceResult: InferenceResult, template: PromptTemplate }> {
        let res = await this.lm.infer(tpl.prompt(prompt), params, options);
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
            if (it == 1) {
                tpl.pushToHistory({
                    user: prompt.replace("{prompt}", prompt),
                    assistant: res.text,
                });
            } else {
                tpl.pushToHistory({
                    assistant: res.text,
                });
            }
            return { inferenceResult: res, template: tpl }
        }
    }

    async abort() {
        this.lm.abort()
    }
}

export {
    Agent,
}

