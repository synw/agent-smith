//import { LmTask, LmTaskConf, LmTaskOutput, LmTaskToolSpec } from "../../../../../lmtask/dist/main.js";
import { LmTask, LmTaskConf, LmTaskOutput, LmTaskToolSpec } from "@agent-smith/lmtask";
import { LmExpert } from "@agent-smith/brain";
import { input } from "@inquirer/prompts";
import { compile, serializeGrammar } from "@intrinsicai/gbnfgen";
import color from "ansi-colors";
import ora from 'ora';
import { brain, initAgent, taskBuilder } from "../../../agent.js";
import { query } from "../../../cli.js";
import { readClipboard } from "../../../cmd/sys/clipboard.js";
import { readTool } from "../../../db/read.js";
import { usePerfTimer } from "../../../main.js";
import { isChatMode, runMode } from "../../../state/state.js";
import { program } from "../../cmds.js";
import { executeAction } from "../actions/cmd.js";
import { parseCommandArgs, parseTaskConfigOptions } from "../options_parsers.js";
import { runtimeDataError, runtimeWarning } from "../user_msgs.js";
import { formatStats, processOutput, readPromptFile } from "../utils.js";
import { executeWorkflow } from "../workflows/cmd.js";
import { configureTaskModel, mergeInferParams } from "./conf.js";
import { McpServer } from "../mcp.js";
import { openTaskSpec } from "./utils.js";

async function executeTask(
    name: string, payload: Record<string, any>, options: Record<string, any>, quiet?: boolean, expert?: LmExpert
): Promise<LmTaskOutput> {
    await initAgent();
    if (options.debug) {
        console.log("Payload:", payload);
        console.log("Task options:", options);
    }
    const taskFileSpec = openTaskSpec(name);
    // merge passed options from payload
    const opts = payload?.inferParams ? { ...options, ...payload.inferParams } : options
    const conf = parseTaskConfigOptions(opts);
    if (options.debug) {
        console.log("conf:", conf);
    }
    conf.inferParams = mergeInferParams(conf.inferParams, taskFileSpec.inferParams ?? {});
    const model = configureTaskModel(conf, taskFileSpec);
    if (options?.ctx) {
        model.ctx = options.ctx
    }
    // vars
    const taskSpec = taskFileSpec as LmTask;
    let vars: Record<string, any> = {};
    taskSpec.variables?.optional?.forEach(k => {
        if (k in options) {
            vars[k] = options[k]
        }
    });
    taskSpec.variables?.required?.forEach(k => {
        if (k in options) {
            vars[k] = options[k]
        }
    });
    const mcpServers = new Array<McpServer>();
    // mcp tools
    if (taskFileSpec?.mcp) {
        taskSpec.tools = []
        for (const tool of Object.values(taskFileSpec.mcp)) {
            const mcp = new McpServer(tool.command, tool.arguments, tool?.tools ?? null);
            mcpServers.push(mcp);
            await mcp.start();
            const tools = await mcp.extractTools();
            tools.forEach(t => taskSpec.tools?.push(t))
        }
    }
    // tools
    //console.log("Task tools list:", taskSpec.toolsList);
    if (taskSpec.toolsList) {
        if (!taskSpec?.tools) {
            taskSpec.tools = []
        }
        for (const toolName of taskSpec.toolsList) {
            const { found, tool, type } = readTool(toolName);
            if (!found) {
                throw new Error(`tool ${toolName} not found for task ${taskSpec.name}`);
            }
            //console.log("Tool found:", toolName, tool);
            const lmTool: LmTaskToolSpec = {
                ...tool,
                execute: async (params) => {
                    switch (type) {
                        case "action":
                            const res = await executeAction(toolName, params, options, true);
                            return res
                        case "task":
                            conf.quiet = !options?.debug;
                            const tres = await executeTask(name, params, options, true);
                            //console.log("WFTRESP", tres.answer.text);
                            return tres.answer.text
                        case "workflow":
                            const wres = await executeWorkflow(toolName, params, options);
                            return wres
                        default:
                            throw new Error(`unknown tool execution function type: ${type} for ${toolName}`)
                    }
                }
            }
            taskSpec.tools.push(lmTool)
        }
        delete taskSpec.toolsList
    };
    //console.log("TASK SPEC:", JSON.stringify(taskSpec, null, "  "));
    const task = taskBuilder.init(taskSpec);
    // check for grammars
    if (model?.inferParams?.tsGrammar) {
        //console.log("TSG");
        model.inferParams.grammar = serializeGrammar(await compile(model.inferParams.tsGrammar, "Grammar"));
        delete model.inferParams.tsGrammar;
    }
    if (options.debug) {
        console.log("Task model:", model);
        //console.log("Task vars:", vars);
    }
    // expert
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
    //console.log("TPL", ex.template);
    //console.log("ST", thinkStart);
    //console.log("ET", thinkEnd);
    //let fullTxt = ""
    const printToken = (t: string) => {
        //console.log("DEFAULT processToken");
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
            //console.log("THINK processToken");
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
    if (options?.onToken) {
        ex.backend.setOnToken(options.onToken);
    } else {
        ex.backend.setOnToken(processToken);
    }
    const tconf: LmTaskConf = {
        expert: ex,
        model: model,
        debug: options.debug,
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

