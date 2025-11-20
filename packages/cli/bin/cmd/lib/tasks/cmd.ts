import { Agent } from "@agent-smith/agent";
import { TaskConf, TaskOutput } from "@agent-smith/task";
import { input } from "@inquirer/prompts";
import { compile, serializeGrammar } from "@intrinsicai/gbnfgen";
import { default as color, default as colors } from "ansi-colors";
import { PromptTemplate } from "modprompt";
import ora, { Ora } from 'ora';
import { query } from "../../../cli.js";
import { readClipboard } from "../../../cmd/sys/clipboard.js";
import { usePerfTimer } from "../../../main.js";
import { backend } from "../../../state/backends.js";
import { isChatMode, runMode } from "../../../state/state.js";
import { program } from "../../cmds.js";
import { parseCommandArgs } from "../options_parsers.js";
import { runtimeDataError, runtimeWarning } from "../user_msgs.js";
import { formatStats, processOutput, readPromptFile } from "../utils.js";
import { readTask } from "./read.js";

async function executeTask(
    name: string, payload: Record<string, any>, options: Record<string, any>, quiet?: boolean
): Promise<TaskOutput> {
    const agent = new Agent(backend.value!);
    //console.log("EXEC TASK");
    //console.log("TN", name);
    //console.log("AGENT", agent);
    if (options?.debug) {
        console.log("Agent:", colors.bold(agent.lm.name), "( " + agent.lm.providerType + " backend type)");
    }
    const { task, model, conf, vars, mcpServers } = await readTask(name, payload, options, agent);
    //console.log("TASK MODEL", model);
    // check for grammars
    if (model?.inferParams?.tsGrammar) {
        //console.log("TSG");
        model.inferParams.grammar = serializeGrammar(await compile(model.inferParams.tsGrammar, "Grammar"));
        delete model.inferParams.tsGrammar;
    }
    if (options?.debug) {
        console.log("Task model:", model);
        console.log("Task vars:", vars);
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
    const hasTools = options?.tools;

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
                if (options?.verbose === true) {
                    skipNextEmptyLinesToken = true;
                    continueWrite = true;
                }
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

    const spinnerInit = (name: string) => ora(`Executing ${name} tool ...`);
    let tcspinner: Ora;
    const onToolCall = (tc: Record<string, any>) => {
        //console.log("TC START");
        console.log("⚒️ ", color.bold(name), "=>", `${color.yellowBright(tc.name)}`, tc.arguments);
        tcspinner = spinnerInit(tc.name);
        tcspinner.start();
        //console.log("TC END START");
    }
    const onToolCallEnd = (tr: any) => {
        tcspinner.stop();
    }
    //console.log("OOT", options?.onToken, "/", processToken);
    if (options?.onToken) {
        task.agent.lm.onToken = options.onToken;
    } else {
        task.agent.lm.onToken = processToken;
    }
    //console.log("BOT", ex.backend.lm.onToken);
    if (!conf?.inferParams) {
        conf.inferParams = {}
    }
    conf.inferParams.stream = true;
    if (conf?.model) {
        delete conf.model
    }
    const tconf: TaskConf = {
        model: model,
        //debug: options?.debug ?? false,
        onToolCall: onToolCall,
        onToolCallEnd: onToolCallEnd,
        ...conf,
    }
    //console.log("CONF", conf);
    //console.log("TCONF", tconf);
    //console.log("RUN", task);
    let out: TaskOutput;

    //console.log("CLI EXEC TASK", payload.prompt, "\nVARS:", vars, "\nOPTS", tconf)
    out = await task.run({ prompt: payload.prompt, ...vars }, tconf);
    //console.log("END TASK", out);
    if (!out.answer.text.endsWith("\n")) {
        console.log()
    }

    // close mcp connections
    mcpServers.forEach(async (s) => await s.stop());
    await processOutput(out);
    // chat mode
    if (isChatMode.value) {
        /*if (brain.ex.name != ex.name) {
            brain.setDefaultExpert(ex);
        }*/
        //ex.template.pushToHistory({ user: payload.prompt, assistant: out.answer.text });
        // loop
        const data = { message: '>', default: "" };
        const prompt = await input(data);
        if (prompt == "/q") {
            isChatMode.value = false;
            if (runMode.value == "cmd") {
                process.exit(0)
            } else {
                await query(program)
            }
        } else {
            await executeTask(name, { ...vars, prompt: prompt }, options, quiet)
        }
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
    //console.log("TASK OUT", out);
    return out
}

async function executeTaskCmd(
    name: string,
    targs: Array<any> = []
): Promise<TaskOutput> {
    const { args, options } = parseCommandArgs(targs);
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
    }
    const params = { args: args, prompt: pr };
    return await executeTask(name, params, options)
}

export {
    executeTask,
    executeTaskCmd
};

