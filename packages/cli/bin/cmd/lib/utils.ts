import { InferenceStats } from "@locallm/types";
import { formatMode, initFilepaths, outputMode, promptfilePath } from "../../state/state.js";
import { writeToClipboard } from "../sys/clipboard.js";
import { readFile } from "../sys/read.js";
import { splitThinking } from "../../utils/text.js";
import { runtimeError } from "./user_msgs.js";
import { MarkedExtension, marked } from 'marked';
import { markedTerminal } from "marked-terminal";

marked.use(markedTerminal() as MarkedExtension);

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
            try {
                data = JSON.stringify(res);
            } catch (e) {
                runtimeError("Unable to parse json result")
            }
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

export {
    processOutput,
    readPromptFile,
};

