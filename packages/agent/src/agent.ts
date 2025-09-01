import { Lm } from "@locallm/api";
import { InferenceParams, ToolSpec, HistoryTurn, InferenceOptions, InferenceResult } from "@locallm/types";
import { PromptTemplate } from 'modprompt';
import { ToolTurn } from "modprompt/dist/interfaces.js";

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
            const toolsResults = new Array<{ id: string, content: any }>();
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
                    toolsResults.push({ id: tc.id ?? "", content: toolCallResult });
                } else {
                    if (options?.debug || options?.verbose) {
                        console.log("[-] Tool", tool.name, "execution refused");
                    }
                }
            }
            this.history.push({ tools: { results: toolsResults, calls: res.toolCalls } });
            if (options?.tools) {
                options.tools = Object.values(this.tools);
            }
            /*if (options?.history) {
                options.history = this.history;
            }*/
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
        //if (this.tools) {
        const toolResponseStart = tpl.toolsDef?.response.split("{tools_response}")[0];
        const toolCallStart = tpl.toolsDef?.response.split("{tool}")[0];
        if (!toolCallStart || !toolResponseStart) {
            throw new Error(`Tool definition malformed in template ${tpl.name}`)
        }
        //}
        //console.log("\nProcessing answer", res.text);
        //const atxt = tpl?.tags?.think ? extractBetweenTags(res.text, tpl.tags.think.start, tpl.tags.think.end) : res.text;
        const { isToolCall, toolsCall, error } = tpl.processAnswer(res.text);
        if (error) {
            throw new Error(`error processing tool call answer:\n, ${error}`);
        }
        //console.log("\nProcessed answer", isToolCall, toolsCall, error);
        const toolsUsed: Record<string, ToolTurn> = {};
        if (isToolCall) {
            //if (options?.debug) {console.log("LMC", options);}
            // 1. find the which tool
            //const tres = tpl.tools.find((t) => t.name == "")
            //let toolsResponses = new Array<string>();
            for (const toolCall of toolsCall) {
                // get the tool
                if (!("name" in toolCall)) {
                    throw new Error(`tool call does not includes a name in it's response:\n${toolCall}`);
                }
                if (!("arguments" in toolCall)) {
                    throw new Error(`tool call does not includes arguments in it's response:\n${toolCall}`);
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
                    console.log("\n* Calling tool", tool.name + ":", toolCall);
                }
                /*if (options?.onToolCall) {
                    options.onToolCall(toolCall);
                }*/
                //console.log("")
                //console.log("RAW TOOL CALL", toolCall);
                //console.log("-------- tool call -----------");
                const toolResp = await tool.execute(toolCall.arguments);
                if (options?.debug || options?.verbose) {
                    console.log("[x] Executed tool", tool.name + ":", toolResp);
                }
                //console.log("-------- end tool call -----------");
                /*if (options?.onToolCallEnd) {
                    options.onToolCallEnd(toolResp);
                }*/
                toolsUsed[toolCall.name] = {
                    call: toolCall,
                    response: toolResp,
                };
                /*const resp = tpl.encodeToolResponse(toolResp);
                console.log("TOOL RESP", resp);
                toolsResponses.push(resp);*/
                //sconsole.log("RAW TOOL RESP", toolResp);
                // process tool response
                //const resp = tpl.encodeToolResponse(toolResp);
                if (options?.debug === true) {
                    console.log("> Tool response:", toolResp);
                }
                //toolsResponses.push(toolResp);
            }

            /*let toolsRespMsg = "";
            if (toolsResponses.length == 1) {
                toolsRespMsg = toolsResponses[0];
            } else {
                toolsRespMsg = JSON.stringify(toolsResponses);
            }*/
            //console.log("TOOL CALLS", toolsCall.map(t => t.name));
            //console.log("TOOLS USED", toolsUsed.length);
            if (it == 1) {
                tpl.pushToHistory({
                    user: prompt.replace("{prompt}", prompt),
                    assistant: res.text,
                    tools: toolsUsed,
                });
            } else {
                tpl.pushToHistory({
                    assistant: res.text,
                    tools: toolsUsed,
                });
            }
            //const toolCallOnToken = options?.isDebug ? undefined : (t) => null;
            /*if (options?.debug) {
                //@ts-ignore
                res = await this.expert.think(
                    tpl.prompt(pr),
                    { ...ip, stream: true },
                    { skipTemplate: true },
                );
            } else {*/
            //console.log("\n----------------- T -----------------", this.def.name, stream);
            //@ts-ignore                
            res = await this.lm.infer(
                tpl.prompt(prompt),
                params,
                options,
            );
            //console.log("\n----------------- END T -----------------");
            //}
            return await this.runAgentWithTemplate(it, prompt, params, options, tpl)
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
}

export {
    Agent,
}

