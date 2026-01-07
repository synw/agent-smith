import { TaskConf, TaskOutput } from "@agent-smith/task";
import { compile, serializeGrammar } from "@intrinsicai/gbnfgen";
import { InferenceParams } from "@locallm/types/dist/inference.js";
import { default as color, default as colors } from "ansi-colors";
import { PromptTemplate } from "modprompt";
import ora, { Ora } from 'ora';
import { TaskSettings } from "../../../interfaces.js";
import { usePerfTimer } from "../../../main.js";
import { backend, backends, listBackends } from "../../../state/backends.js";
import { setChatInferenceParams, setChatTemplate } from "../../../state/chat.js";
import { agent, isChatMode } from "../../../state/state.js";
import { initTaskSettings, isTaskSettingsInitialized, tasksSettings } from "../../../state/tasks.js";
import { chat, program } from "../../cmds.js";
import { parseCommandArgs } from "../options_parsers.js";
import { runtimeDataError, runtimeError, runtimeWarning } from "../user_msgs.js";
import { formatStats, processOutput } from "../utils.js";
import { readTask } from "./read.js";
import { getTaskPrompt } from "./utils.js";

async function executeTask(
    name: string, payload: Record<string, any>, options: Record<string, any>
): Promise<TaskOutput> {
    //console.log("EXEC TASK", payload, options);
    //console.log("TN", name);
    //console.log("AGENT", agent);
    if (!isTaskSettingsInitialized.value) {
        initTaskSettings()
    }
    const hasSettings = Object.keys(tasksSettings).includes(name);
    let settings: TaskSettings = {};
    if (hasSettings) {
        settings = tasksSettings[name]
    }
    if (options?.backend) {
        if (options.backend in backends) {
            agent.lm = backends[options.backend]
        } else {
            const bks = await listBackends(false);
            runtimeDataError(`The backend ${options.backend} is not registered in config. Available backends:\n`, bks)
        }
    } else if (settings?.backend) {
        agent.lm = backends[settings.backend]
    }
    if (options?.debug || options?.backend) {
        console.log("Agent:", colors.bold(agent.lm.name), "( " + agent.lm.providerType + " backend type)");
    }
    const { task, model, conf, vars, mcpServers, taskDir } = await readTask(name, payload, options, agent);
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
        tpl = new PromptTemplate(model.template ?? "none");
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
    const printToken = (t: string) => {
        if (options?.tokens === true) {
            let txt = t;
            txt = c ? t : `\x1b[100m${t}\x1b[0m`
            process.stdout.write(txt);
            ++i;
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
    const perfTimer = usePerfTimer(false)
    let i = 0;
    const processToken = (t: string) => {
        //console.log("T", t);
        if (i == 0) { perfTimer.start() }
        spinner.text = formatTokenCount(i)
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
                    let msg = color.dim("Thinking:") + ` ${i} ${color.dim("tokens")}`;
                    msg = msg + " " + color.dim(perfTimer.time())
                    spinner.info(msg);
                    return
                }
            }
        } else {
            if (tpl) {
                if (t == tpl.tags.think?.end) {
                    let msg = color.dim("Thinking:") + ` ${i} ${color.dim("tokens")}`;
                    msg = msg + " " + color.dim(perfTimer.time())
                    console.log(msg)
                }
            }
        }
        if (hasTools && tpl) {
            // check for tool call and silence the output
            if (t == tpl.tags.toolCall?.start) {
                continueWrite = false;
                return
            } else if (t == tpl.tags.toolCall?.end) {
                //if (options?.verbose === true) {
                skipNextEmptyLinesToken = true;
                continueWrite = true;
                // }
                return
            }
        }
        if (continueWrite) {
            if (skipNextEmptyLinesToken) {
                if (t == "\n\n") {
                    skipNextEmptyLinesToken = false
                    return
                }
            }
            //if (!quiet) {
            printToken(t);
            //}
        }
        ++i;
    };

    const spinnerInit = (name: string) => ora(`Executing ${name} tool ...\n`);
    let tcspinner: Ora;
    const onToolCall = (tc: Record<string, any>) => {
        //console.log("TC START");
        console.log("⚒️ ", color.bold(name), "=>", `${color.yellowBright(tc.name)}`, tc.arguments);
        tcspinner = spinnerInit(tc.name);
        tcspinner.start();
        //console.log("TC END START");
    }
    const onToolCallEnd = (tr: any) => {
        /*if (options?.verbose || options?.debug) {
            console.log(tr)
        }*/
        tcspinner.stop();
    }
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
        ...conf,
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
    } catch (e) {
        const errMsg = `${e}`;
        if (errMsg.includes("502 Bad Gateway")) {
            runtimeError("The server answered with a 502 Bad Gateway error. It might be down or misconfigured. Check your inference server.")
            if (options?.debug) {
                throw new Error(errMsg)
            }
            //@ts-ignore
            return
        } else if (errMsg.includes("404 Not Found")) {
            runtimeError("The server answered with a 404 Not Found error. That usually mean that the model you are requesting does not exist on the server.")
            //@ts-ignore
            return
        } else if (errMsg.includes("fetch failed")) {
            runtimeError("The server is not responding. Check if your inference backend is running.")
            //@ts-ignore
            return
        } else {
            throw new Error(errMsg)
        }
    }
    //console.log("END TASK", out);
    if (!out.answer.text.endsWith("\n")) {
        console.log()
    }
    // close mcp connections
    mcpServers.forEach(async (s) => await s.stop());
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
            options.history = task.def.shots
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
        await chat(program, options);
    }
    if (options?.debug === true || options?.verbose === true) {
        try {
            console.log("\n", formatStats(out.answer.stats))
            if (options?.debug === true) {
                console.log(out.answer.stats)
            }
        } catch (e) {
            runtimeWarning("Error formating stats:", `${e}`)
        }
    }
    if (options?.backend) {
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
    /*const { args, options } = parseCommandArgs(targs);
    let pr: string;
    //console.log("TOPT", options);
    if (options?.clipboardInput === true) {
        pr = await readClipboard()
    } else if (options?.inputFile === true) {
        pr = readPromptFile()
    } else {
        if (args[0] !== undefined) {
            pr = args[0]
        }
        else {
            runtimeDataError("task", name, "provide a prompt or use input options")
            throw new Error()
        }
    }*/
    const ca = parseCommandArgs(targs);
    const prompt = await getTaskPrompt(name, ca.args, ca.options);
    return await executeTask(name, { prompt: prompt }, ca.options)
}

export {
    executeTask,
    executeTaskCmd
};

