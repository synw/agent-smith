//import { LmTask } from "../../../../lmtask/dist/interfaces.js";
import { InferenceStats } from "@locallm/types";
import { marked } from "../../agent.js";
import { formatMode, initFilepaths, inputMode, outputMode, promptfilePath } from "../../state/state.js";
import { readClipboard, writeToClipboard } from "../sys/clipboard.js";
import { readFile } from "../sys/read.js";
import { splitThinking } from "../../utils/text.js";

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
    processOutput,
    readPromptFile,
};

