//import { LmTask, LmTaskConf, LmTaskOutput, LmTaskToolSpec } from "../../../../../lmtask/dist/main.js";
//import { LmExpert } from "../../../../../brain/dist/main.js";
import { LmTaskConf, LmTaskOutput } from "@agent-smith/lmtask";
import { LmExpert } from "@agent-smith/brain";
//import { LmTaskConf, LmTaskOutput } from "../../../../../lmtask/dist/main.js";
import { input } from "@inquirer/prompts";
import { compile, serializeGrammar } from "@intrinsicai/gbnfgen";
import color from "ansi-colors";
import ora from 'ora';
import { brain } from "../../../agent.js";
import { query } from "../../../cli.js";
import { readClipboard } from "../../../cmd/sys/clipboard.js";
import { usePerfTimer } from "../../../main.js";
import { isChatMode, runMode } from "../../../state/state.js";
import { program } from "../../cmds.js";
import { parseCommandArgs } from "../options_parsers.js";
import { runtimeDataError, runtimeWarning } from "../user_msgs.js";
import { formatStats, processOutput, readPromptFile } from "../utils.js";
import { readTask } from "./read.js";

async function executeTask(
    name: string, payload: Record<string, any>, options: Record<string, any>, quiet?: boolean, expert?: LmExpert
): Promise<LmTaskOutput> {
    const { task, model, conf, vars, mcpServers } = await readTask(name, payload, options);
    // check for grammars
    if (model?.inferParams?.tsGrammar) {
        //console.log("TSG");
        model.inferParams.grammar = serializeGrammar(await compile(model.inferParams.tsGrammar, "Grammar"));
        delete model.inferParams.tsGrammar;
    }
    if (options?.debug) {
        console.log("Task model:", model);
        //console.log("Task vars:", vars);
    }
    // expert
    //console.log("MT", model.template, "OT", options?.template);
    const ex = expert ?? brain.getOrCreateExpertForModel(model.name, model.template);
    if (!ex) {
        throw new Error("No expert found for model " + model.name)
    }
    ex.checkStatus();
    //ex.backend.setOnStartEmit(() => console.log("[START]"));
    let i = 0;
    let c = false;
    const hasThink = ex.template?.tags?.think;
    const hasTools = ex.template?.tags?.toolCall;
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
    let processToken = printToken;
    if ((hasThink || hasTools) && !options?.debug) {
        let continueWrite = true;
        let skipNextEmptyLinesToken = false;
        const spinner = ora("Thinking ...");
        //const timer = usePerfTimer();        
        const ts = "Thinking";
        const te = color.dim("tokens");
        const formatTokenCount = (i: number) => {
            return `${ts} ${color.bold(i.toString())} ${te}`
        };
        const perfTimer = usePerfTimer(false)
        let i = 0;
        processToken = (t: string) => {
            if (i == 0) { perfTimer.start() }
            spinner.text = formatTokenCount(i)
            //if (i == ) { timer.start() };
            if (!options?.verbose) {
                if (hasThink) {
                    if (t == ex.template.tags.think?.start) {
                        //console.log("Start thinking token", thinkStart);
                        spinner.start();
                        continueWrite = false;
                        return
                    } else if (t == ex.template.tags.think?.end) {
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
                if (t == ex.template.tags.think?.end) {
                    let msg = color.dim("Thinking:") + ` ${i} ${color.dim("tokens")}`;
                    msg = msg + " " + color.dim(perfTimer.time())
                    console.log(msg)
                }
            }
            if (hasTools) {
                // check for tool call and silence the output
                if (t == ex.template.tags.toolCall?.start) {
                    continueWrite = false;
                    return
                } else if (t == ex.template.tags.toolCall?.end) {
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
    }
    //const spinnerInit = (name: string) => ora(`Executing ${name} tool ...`);
    //let tcspinner: Ora;
    const onToolCall = (tc: Record<string, any>) => {
        //console.log("TC START");
        console.log("⚒️ ", color.bold(name), "=>", `${color.yellowBright(tc.name)}`, tc.arguments);
        //tcspinner = spinnerInit(tc.name);
        //tcspinner.start();
        //console.log("TC END START");
    }
    /*const onToolCallEnd = (tr: any) => {
        tcspinner.stop();
    }*/
   //console.log("OOT", options?.onToken, "/", processToken);
    if (options?.onToken) {
        ex.backend.setOnToken(options.onToken);
    } else {
        ex.backend.setOnToken(processToken);
    }
    //console.log("BOT", ex.backend.lm.onToken);
    conf.inferParams.stream = true;
    const tconf: LmTaskConf = {
        expert: ex,
        model: model,
        debug: options?.debug ?? false,
        onToolCall: onToolCall,
        //onToolCallEnd: onToolCallEnd,
        ...conf,
    }
    tconf.expert = ex;
    let out: LmTaskOutput;
    try {
        out = await task.run({ prompt: payload.prompt, ...vars }, tconf);
        if (!out.answer.text.endsWith("\n")) {
            console.log()
        }
    }
    catch (err) {
        throw new Error(`executing task: ${name} (${err})`);
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
            //console.log("HIST", ex.template.history.length)
            await executeTask(name, { ...vars, prompt: prompt }, options, quiet, ex)
        }
    }
    if (options?.debug === true || options?.verbose === true) {
        try {
            console.log("\n", formatStats(out.answer.stats))
        } catch (e) {
            runtimeWarning("Error formating stats:", `${e}`)
        }
    }
    //@ts-ignore
    return out
}

async function executeTaskCmd(
    name: string,
    targs: Array<any> = []
): Promise<LmTaskOutput> {
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

