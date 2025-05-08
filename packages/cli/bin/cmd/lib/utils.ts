//import { LmTask } from "../../../../lmtask/dist/interfaces.js";
import { InferenceStats } from "@locallm/types";
import { marked } from "../../agent.js";
import { Cmd } from "../../interfaces.js";
import { formatMode, initFilepaths, inputMode, outputMode, promptfilePath } from "../../state/state.js";
import { modes } from "../clicmds/modes.js";
import { readClipboard, writeToClipboard } from "../sys/clipboard.js";
import { readFile } from "../sys/read.js";
import { extractBetweenTags, splitThinking } from "../../utils/text.js";

async function setOptions(
    args: Array<string> = [], options: Record<string, any>,
): Promise<Array<string>> {
    //console.log("Args:", args);
    //console.log("Opts", options);
    /*if (runMode.value == "cli") {
        return args
    };*/
    for (const k of Object.keys(options)) {
        let opt: Cmd;
        if (k.length == 1) {
            opt = modes["-" + k.toLowerCase()];
        } else {
            opt = modes["--" + k.toLowerCase()];
        }
        //console.log("OPT", opt)
        await opt.cmd([], undefined)
    }
    if (inputMode.value == "promptfile") {
        const p = readPromptFile();
        args.push(p)
    } else if (inputMode.value == "clipboard") {
        const p = await readClipboard();
        args.push(p)
    }
    return args
}

function readPromptFile(): string {
    initFilepaths();
    return readFile(promptfilePath.value)
}

async function processOutput(res: any) {
    //if (!(outputMode.value == "clipboard")) { return }
    let data = "";
    //console.log("Process OUTPUT", typeof res);
    let hasTextData = false;
    if (typeof res == "object") {
        if (res?.answer?.text) {
            //console.log("****************** TPL", res?.answer?.template);
            if (res?.template?.tags?.think) {
                const { finalAnswer } = splitThinking(res.answer.text, res.template.tags.think.start, res.template.tags.think.end);
                data = finalAnswer;
            } else {
                data = res.answer.text;
            }
            hasTextData = true;
        } else {
            data = JSON.stringify(res);
        }
    } else {
        data = res;
    }
    //console.log("MODE", inputMode.value);
    //onsole.log("OUTPUT", typeof res, data);
    if (outputMode.value == "clipboard") {
        //console.log("Writing to kb", data)
        await writeToClipboard(data);
    }
    if (hasTextData) {
        if (formatMode.value == "markdown") {
            console.log("\n------------------\n");
            console.log((marked.parse(data) as string).trim())
        }
    }
}

async function parseInputOptions(options: any): Promise<string | null> {
    let out: string | null = null;
    if (options?.Ic == true || inputMode.value == "clipboard") {
        //console.log("Input copy option");
        out = await readClipboard()
    } else if (options.Pf || inputMode.value == "promptfile") {
        out = readPromptFile()
    }
    return out
}

function formatStats(stats: InferenceStats): string {
    const buf = new Array<string>();
    buf.push(`${stats.tokensPerSecond} tps`);
    buf.push(`- ${stats.totalTimeSeconds}s`);
    buf.push(`(${stats.ingestionTimeSeconds}s ingestion /`);
    buf.push(`${stats.inferenceTimeSeconds}s inference)`);
    return buf.join(" ")
}

export {
    formatStats,
    //initTaskConf,
    //initTaskParams,
    //initTaskVars,
    parseInputOptions,
    processOutput,
    readPromptFile,
    setOptions
};

