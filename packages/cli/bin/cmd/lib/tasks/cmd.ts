//import { LmTask, LmTaskConf, LmTaskOutput, LmTaskToolSpec } from "../../../../../lmtask/dist/main.js";
import { LmTask, LmTaskConf, LmTaskOutput, LmTaskToolSpec } from "@agent-smith/lmtask";
import { compile, serializeGrammar } from "@intrinsicai/gbnfgen";
import ora from 'ora';
import { brain, initAgent, taskBuilder } from "../../../agent.js";
import { readTool } from "../../../db/read.js";
import { isChatMode, isDebug, isQuiet, isShowTokens, isVerbose } from "../../../state/state.js";
import { parseArgs } from "../../../utils/args.js";
import { executeActionCmd, } from "../actions/cmd.js";
import { formatStats, parseInputOptions } from "../utils.js";
import { executeWorkflowCmd } from "../workflows/cmd.js";
import { configureTaskModel, mergeConfOptions, mergeInferParams } from "./conf.js";
import { openTaskSpec } from "./utils.js";
//import { usePerfTimer } from "../../../primitives/perf.js";

async function executeTaskCmd(
    args: Array<string> | Record<string, any> = [], options: Record<string, any> = {}
): Promise<LmTaskOutput> {
    //console.log("TARGS", args);
    await initAgent();
    if (isDebug.value) {
        console.log("Task args:", args);
        console.log("Task options:", options);
    }
    const isWorkflow = !Array.isArray(args);
    let name: string;
    let pr: string;
    if (!isWorkflow) {
        name = args.shift()!;
        //const params = args.filter((x) => x.length > 0);
        //console.log("TaskARGS", args);
        const _pr = await parseInputOptions(options);
        //console.log("PROMPT:", _pr);
        //const { inferenceVars, currentArgs } = parseInferenceArgs(args);
        //sconsole.log("IV", inferenceVars, "CA", currentArgs);
        if (!_pr) {
            const p = args.shift();
            if (p) {
                pr = p
            } else {
                throw new Error("Please provide a prompt")
            }
        } else {
            pr = _pr;
        }
        //console.log("TaskARGS F", args);
    } else {
        //console.log("TW ARGS", args);
        if (!(args?.name)) {
            throw new Error("Provide a task name param")
        }
        if (!(args?.prompt)) {
            throw new Error("Provide a task prompt param")
        }
        name = args.name;
        //delete args.name;
        pr = args.prompt;
        //delete args.prompt;
    }
    //console.log("TARGS", args);
    /*const { found, path } = getFeatureSpec(name, "task" as FeatureType);
    if (!found) {
        throw new Error(`Task ${name} not found`);
    }
    //console.log("EFM", brain.expertsForModels);    
    const res = readTask(path);
    if (!res.found) {
        throw new Error(`Task ${name}, ${path} not found`)
    }
    //const taskRawSpec = taskBuilder.readFromYaml(res.ymlTask);
    const taskFileSpec = YAML.parse(res.ymlTask) as LmTaskFileSpec;*/
    //console.log("Opening task");
    const taskFileSpec = openTaskSpec(name);
    //console.log("Opened task");
    // model
    //console.log("ARGSIN", args);
    let { conf, vars } = parseArgs(args, true);
    //console.log("Parsed args");
    //console.log("PCONF", conf);
    //console.log("PVARS", vars);
    conf = mergeConfOptions(conf, options);
    conf.inferParams = mergeInferParams(conf.inferParams, taskFileSpec.inferParams ?? {});
    //console.log("Merged infer params");
    const model = configureTaskModel(conf, taskFileSpec);
    //console.log("Configured task model");
    // tools
    const taskSpec = taskFileSpec as LmTask;
    //console.log("Task tools list:", taskSpec.toolsList);
    if (taskSpec.toolsList) {
        taskSpec.tools = []
        for (const toolName of taskSpec.toolsList) {
            const { found, tool, type } = readTool(toolName);
            if (!found) {
                throw new Error(`tool ${toolName} not found for task ${taskSpec.name}`);
            }
            //console.log("Tool found:", toolName, tool);
            const lmTool: LmTaskToolSpec = {
                ...tool,
                execute: async (args) => {
                    //console.log("TASK: Execute tool", type, toolName, args);
                    const normalizedArgs = Array.isArray(args) ? [toolName, ...args] : {
                        name: toolName,
                        ...args,
                    };
                    switch (type) {
                        case "action":
                            const res = await executeActionCmd(normalizedArgs, conf, true);
                            return res
                        case "task":
                            conf.quiet = !isDebug.value;
                            const tres = await executeTaskCmd(normalizedArgs, conf);
                            //console.log("WFTRESP", tres.answer.text);
                            return tres.answer.text
                        case "workflow":
                            const wres = await executeWorkflowCmd(toolName, normalizedArgs, conf);
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
    if (isDebug.value) {
        console.log("Task model:", model);
        console.log("Task vars:", vars);
    }
    // expert
    const ex = brain.getOrCreateExpertForModel(model.name, model.template);
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
        if (isShowTokens.value) {
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
    if ((hasThink || hasTools) && !isDebug.value) {
        let continueWrite = true;
        let skipNextEmptyLinesToken = false;
        const spinner = ora("Thinking ...");
        //const timer = usePerfTimer();
        processToken = (t: string) => {
            //if (i == 0) { timer.start() };
            //console.log("THINK processToken");
            if (isQuiet.value) {
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
                        /*if (isVerbose.value || isDebug.value) {
                            spinner.stopAndPersist({ text: "Thinking time: " + timer.time() });
                        } else {
                            spinner.stop()
                        }*/
                        spinner.stop()
                        return
                    }
                }
            }
            if (hasTools) {
                // check for tool call and silence the output
                if (t == ex.template.tags.toolCall?.start) {
                    continueWrite = false;
                    return
                } else if (t == ex.template.tags.toolCall?.end) {
                    if (isVerbose.value) {
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
                printToken(t);
            }
            ++i;
        };
    }
    //const spinnerInit = (name: string) => ora(`Executing ${name} tool ...`);
    //let tcspinner: Ora;
    const onToolCall = (tc: Record<string, any>) => {
        //console.log("TC START");
        console.log("⚒️ ", `Executing [${name}]`, tc.name, tc.arguments);
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
        debug: isDebug.value,
        onToolCall: onToolCall,
        //onToolCallEnd: onToolCallEnd,
        ...conf,
    }
    tconf.expert = ex;
    let out: LmTaskOutput;
    try {
        out = await task.run({ prompt: pr, ...vars }, tconf);
        if (!out.answer.text.endsWith("\n")) {
            console.log()
        }
    }
    catch (err) {
        throw new Error(`executing task: ${name} (${err})`);
    }
    // chat mode
    if (isChatMode.value) {
        if (brain.ex.name != ex.name) {
            brain.setDefaultExpert(ex);
        }
        brain.ex.template.pushToHistory({ user: pr, assistant: out.answer.text });
    }
    if (isDebug.value || isVerbose.value) {
        console.log("\n", formatStats(out.answer.stats))
    }
    return out
}

export { executeTaskCmd };
