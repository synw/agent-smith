import { TaskConf, TaskOutput } from "@agent-smith/task";
import { compile, serializeGrammar } from "@intrinsicai/gbnfgen";
import { InferenceParams, type ToolCallSpec } from "@locallm/types";
import { default as color, default as colors } from "ansi-colors";
import { PromptTemplate, templates } from "modprompt";
import ora from 'ora';
import { TaskSettings } from "../../../interfaces.js";
import { usePerfTimer } from "../../../main.js";
import { backend, backends, listBackends } from "../../../state/backends.js";
import { setChatInferenceParams, setChatTemplate } from "../../../state/chat.js";
import { isChatMode } from "../../../state/state.js";
import { initTaskSettings, isTaskSettingsInitialized, tasksSettings } from "../../../state/tasks.js";
import { chat, program } from "../../cmds.js";
import { parseCommandArgs } from "../options_parsers.js";
import { runtimeDataError, runtimeError, runtimeWarning } from "../user_msgs.js";
import { processOutput } from "../utils.js";
import { readTask } from "./read.js";
import { getTaskPrompt } from "./utils.js";
import { Agent } from "@agent-smith/agent";

async function executeTask(
    name: string, payload: Record<string, any>, options: Record<string, any>
): Promise<TaskOutput> {
    //console.log("EXEC TASK", payload, options);
    //console.log("TN", name);
    //console.log("AGENT", agent);
    if (!isTaskSettingsInitialized.value) {
        initTaskSettings()
    }
    const agent = new Agent(backend.value!, name);
    const hasSettings = Object.keys(tasksSettings).includes(name);
    let settings: TaskSettings = {};
    if (hasSettings) {
        settings = tasksSettings[name]
    }
    if (options?.backend) {
        if (options.backend in backends) {
            agent.lm = backends[options.backend]
            //console.log("SET AGENT BACKEND TO", backends[options.backend]);
        } else {
            const bks = await listBackends(false);
            runtimeDataError(`The backend ${options.backend} is not registered in config. Available backends:\n`, bks)
        }
    } else if (settings?.backend) {
        //console.log("SET AGENT BACKEND TO", backends[options.backend]);
        agent.lm = backends[settings.backend]
    }
    if (options?.debug || options?.backend) {
        console.log("Agent:", colors.bold(agent.name), "( " + agent.lm.providerType + " backend type)");
    }
    const { task, model, conf, vars, mcpServers, taskDir } = await readTask(name, payload, options, agent);
    if (options?.debug && mcpServers.length > 0) {
        console.log("Starting", mcpServers.length, "mcp servers")
    }
    for (const mcp of mcpServers) {
        await mcp.start();
        const tools = await mcp.extractTools();
        tools.forEach(t => task.def.tools?.push(t));
        if (options?.debug) {
            console.log("MCP start", mcp.name);
        }
    }
    //console.log("TASKCONF IP", conf.inferParams);
    if (hasSettings) {
        if (!model?.inferParams) {
            model.inferParams = {};
        }
        if (settings?.model && !conf?.model?.name) {
            model.name = settings.model;
        }
        if (settings?.template && !conf?.model?.template) {
            model.template = settings.template;
        }
        if (settings?.ctx && !conf?.model?.ctx) {
            model.ctx = settings.ctx;
        }
        if (settings?.max_tokens && !conf?.inferParams?.max_tokens) {
            model.inferParams.max_tokens = settings.max_tokens;
        }
        if (settings?.top_k && !conf?.inferParams?.top_k) {
            model.inferParams.top_k = settings.top_k;
        }
        if (settings?.top_p && !conf?.inferParams?.top_p) {
            model.inferParams.top_p = settings.top_p;
        }
        if (settings?.min_p && !conf?.inferParams?.min_p) {
            model.inferParams.min_p = settings.min_p;
        }
        if (settings?.temperature && !conf?.inferParams?.temperature) {
            model.inferParams.temperature = settings.temperature;
        }
        if (settings?.repeat_penalty && !conf?.inferParams?.repeat_penalty) {
            model.inferParams.repeat_penalty = settings.repeat_penalty;
        }
    }
    //console.log("TASK MODEL", model);
    // check for grammars
    if (model?.inferParams?.tsGrammar) {
        //console.log("TSG");
        model.inferParams.grammar = serializeGrammar(await compile(model.inferParams.tsGrammar, "Grammar"));
        delete model.inferParams.tsGrammar;
    }
    //let i = 0;
    let c = false;
    const useTemplates = agent.lm.providerType !== "openai";
    let hasThink = false;
    let tpl: PromptTemplate | null = null;
    //console.log("Use templates:", useTemplates);
    if (useTemplates) {
        try {
            tpl = new PromptTemplate(model.template ?? "none");
        } catch (e) {
            throw new Error(`Can not load template ${model.template}\nAvailable templates: ${Object.keys(templates)}\n`)
        }
        //console.log("TPL:", tpl.id);
        hasThink = tpl.tags?.think ? true : false;
        //console.log("HT", hasThink);
    }
    if (options?.debug) {
        console.log("Task model:", model);
        console.log("Task vars:", vars);
    }
    //const hasTools = ex.template?.tags?.toolCall;
    //console.log("EX TPL", ex.template);
    //console.log("ST", thinkStart);
    //console.log("ET", thinkEnd);
    //let fullTxt = ""
    let emittedTokens = 0;
    const printToken = (t: string) => {
        if (options?.tokens === true) {
            let txt = t;
            txt = c ? t : `\x1b[100m${t}\x1b[0m`
            process.stdout.write(txt);
            c = !c
        } else {
            /*if (formatMode.value == "markdown") {
                fullTxt += t;
                process.stdout.write('\u001Bc\u001B[3J');
                process.stdout.write(marked.parse(fullTxt) as string);*/
            //} else {
            process.stdout.write(t);
            //}
        }

    };
    let hasTools = false;
    if (task.def?.tools) {
        if (task.def.tools.length > 0) {
            hasTools = true
        }
    }
    //console.log("HAS TOOLS", hasTools);
    let continueWrite = true;
    let skipNextEmptyLinesToken = false;
    const spinner = ora("Thinking ...");
    const ts = "Thinking";
    const te = color.dim("tokens");
    const formatTokenCount = (i: number) => {
        return `${ts} ${color.bold(i.toString())} ${te}`
    };
    const perfTimer = usePerfTimer(false);
    let abort = options?.abort ? options.abort as AbortController : new AbortController();
    const abortTicker = setInterval(() => {
        //console.log("ABS", abort.signal.aborted);
        if (abort.signal.aborted) {
            agent.lm.abort();
            abort = new AbortController()
        }
    }, 200);
    const processToken = (t: string) => {
        if (emittedTokens == 0) { perfTimer.start() }
        spinner.text = formatTokenCount(emittedTokens)
        if (!options?.verbose && !options?.debug) {
            //console.log("TTTTTT", hasThink && tpl);
            if (hasThink && tpl) {
                if (t == tpl.tags.think?.start) {
                    //console.log("Start thinking token", thinkStart);
                    spinner.start();
                    continueWrite = false;
                    return
                } else if (t == tpl.tags.think?.end) {
                    //console.log("End thinking token", thinkEnd);
                    continueWrite = true;
                    skipNextEmptyLinesToken = true;
                    let msg = color.dim("Thinking:") + ` ${emittedTokens} ${color.dim("tokens")}`;
                    msg = msg + " " + color.dim(perfTimer.time())
                    spinner.info(msg);
                    return
                }
            }
        } else {
            if (tpl) {
                if (t == tpl.tags.think?.end) {
                    let msg = color.dim("Thinking:") + ` ${emittedTokens} ${color.dim("tokens")}`;
                    msg = msg + " " + color.dim(perfTimer.time())
                    console.log(msg)
                }
            }
        }
        if (hasTools && tpl) {
            // check for tool call and silence the output
            if (t == tpl.tags.toolCall?.start) {
                if (!options?.debug) {
                    continueWrite = false;
                    if (emittedTokens > 0) {
                        console.log()
                    }
                    return
                }
            } else if (t == tpl.tags.toolCall?.end) {
                skipNextEmptyLinesToken = true;
                continueWrite = true;
                if (!options?.debug) {
                    return
                }
            }
        }
        if (continueWrite) {
            if (skipNextEmptyLinesToken) {
                if (t == "\n\n" || t == "\n") {
                    skipNextEmptyLinesToken = false
                    return
                }
            }
            if (!options?.quiet) {
                if (!options?.isToolCall) {
                    printToken(t);
                } else {
                    if (options?.debug) {
                        printToken(t);
                    }
                }
            }
        }
        ++emittedTokens;
    };

    //const spinnerInit = (name: string) => ora(`Executing the ${name} tool ...\n`);
    //let tcspinner: Ora;
    const _onToolCall = (tc: Record<string, any>) => {
        //console.log("TC START");
        console.log("⚒️ ", color.bold(name), "=>", `${color.yellowBright(tc.name)}`, tc.arguments);
    };
    const onToolCall = options?.onToolCall as (tc: Record<string, any>) => void ?? _onToolCall;
    const _onToolCallEnd = (tr: any) => {
        if (options?.debug) {
            console.log(tr)
        }
    }
    const onToolCallEnd = options?.onToolCallEnd as (tc: Record<string, any>) => void ?? _onToolCallEnd;
    const onToolsTurnStart = options?.onToolsTurnStart ?? undefined;
    const onToolsTurnEnd = options?.onToolsTurnEnd ?? undefined;
    const onTurnEnd = options?.onTurnEnd ?? undefined;
    const onAssistant = options?.onAssistant ?? undefined;
    //console.log("OOT", options?.onToken, "/", processToken);
    if (options?.onToken) {
        task.agent.lm.onToken = options.onToken;
    } else {
        task.agent.lm.onToken = processToken;
    }
    if (!conf?.inferParams) {
        conf.inferParams = {}
    }
    conf.inferParams.stream = true;
    if (conf?.model) {
        delete conf.model
    }
    const tconf: TaskConf = {
        baseDir: taskDir,
        model: model,
        //debug: options?.debug ?? false,
        onToolCall: onToolCall,
        onToolCallEnd: onToolCallEnd,
        onToolsTurnStart: onToolsTurnStart,
        onToolsTurnEnd: onToolsTurnEnd,
        onTurnEnd: onTurnEnd,
        onAssistant: onAssistant,
        ...conf,
    }
    if (options?.history) {
        agent.history = options.history;
    }
    const initialInferParams: InferenceParams = Object.assign({}, conf.inferParams);
    initialInferParams.model = tconf.model;
    //console.log("CONF", conf);
    //console.log("TCONF", tconf);
    //console.log("RUN", task);
    let out: TaskOutput;

    //console.log("CLI EXEC TASK", payload.prompt, "\nVARS:", vars, "\nOPTS", tconf)
    try {
        out = await task.run({ prompt: payload.prompt, ...vars }, tconf);
    } catch (e: any) {
        //console.log("ERR CATCH", e);
        const errMsg = `${e}`;
        if (errMsg.includes("502 Bad Gateway")) {
            runtimeError("The server answered with a 502 Bad Gateway error. It might be down or misconfigured. Check your inference server.")
            if (options?.debug) {
                throw new Error(errMsg)
            }
            //@ts-ignore
            return
        } else if (errMsg.includes("404 Not Found")) {
            runtimeError("The server answered with a 404 Not Found error. That might mean that the model you are requesting does not exist on the server.")
            //@ts-ignore
            return
        } else if (errMsg.includes("400 Bad Request")) {
            runtimeError("The server answered with a 400 Bad Request error. That might mean that the model you are requesting does not exist on the server, a parameter is wrong or missing in your request.")
            //@ts-ignore
            return
        } else if (errMsg.includes("fetch failed")) {
            runtimeError("The server is not responding. Check if your inference backend is running.")
            //@ts-ignore
            return
        } else if (e instanceof DOMException && e.name === 'AbortError') {
            if (options?.debug || options?.verbose) {
                console.log("The request was canceled by the user");
            }
            return {} as TaskOutput
        }
        else {
            throw new Error(errMsg)
        }
    }
    clearInterval(abortTicker);
    //console.log("END TASK", out);
    if (!options?.isToolCall) {
        if (!out.answer.text.endsWith("\n")) {
            console.log()
        }
    }
    //console.log("END", name, "ISCM", isChatMode.value, "isTC", options?.isToolCall)
    if (!isChatMode.value || options?.isToolCall) {
        // close mcp connections
        if (options?.debug && mcpServers.length > 0) {
            console.log("Closing", mcpServers.length, "mcp server(s)")
        }
        mcpServers.forEach((s) => {
            s.stop();
            if (options?.debug) {
                console.log("MCP stop", s.name);
            }
        });
    }
    await processOutput(out);
    // chat mode
    //console.log("CLI CONF IP", initialInferParams);
    if (!options?.isToolCall && isChatMode.value) {
        if (tpl) {
            setChatTemplate(tpl);
        }
        if (task.def.tools) {
            options.tools = task.def.tools
        }
        if (task.def.shots) {
            options.history = options?.history ? [...options.history, ...task.def.shots] : task.def.shots;
        }
        if (task.def.template?.system) {
            options.system = task.def.template.system
        }
        /*if (task.def.template?.afterSystem) {
            options.system = (tpl?.system ?? "") + task.def.template.afterSystem
        }*/
        if (task.def.template?.assistant) {
            options.assistant = task.def.template.assistant
        }
        setChatInferenceParams(initialInferParams);
        await chat(program, options, agent, mcpServers);
    }
    if (options?.debug === true || options?.verbose === true) {
        try {
            console.log(emittedTokens.toString(), color.dim("tokens"), out.answer.stats.tokensPerSecond, color.dim("tps"));
            //console.log("\n", formatStats(out.answer.stats))
            if (options?.debug === true) {
                console.log(out.answer.stats)
            }
        } catch (e) {
            runtimeWarning("Error formating stats:", `${e}`)
        }
    }
    if (options?.backend || settings?.backend) {
        //console.log("SET BACK AGENT BACKEND TO", backend.value);
        // set back the default backend
        agent.lm = backend.value!;
    }
    //console.log("TASK OUT", out);
    return out
}

async function executeTaskCmd(
    name: string,
    targs: Array<any> = []
): Promise<TaskOutput> {
    const ca = parseCommandArgs(targs);
    //console.log("ARGS", ca);
    const prompt = await getTaskPrompt(name, ca.args, ca.options);
    const tr = await executeTask(name, { prompt: prompt }, ca.options)
    //console.log("TR", tr);
    return tr

}

export {
    executeTask,
    executeTaskCmd
};

