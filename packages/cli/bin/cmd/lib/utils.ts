import { default as fs } from "fs";
import { outputMode, promptfile } from "../../state/state.js";
import { inputMode, runMode } from "../../state/state.js";
import { readClipboard, writeToClipboard } from "../sys/clipboard.js";
import { modes } from "../options/modes.js";

async function setOptions(
    options: Record<string, any>, args: Array<string> = []
): Promise<Array<string>> {
    if (runMode.value == "cli") { return args };
    //console.log("OPTIONS", options);
    for (const k of Object.keys(options)) {
        const opt = modes["-" + k.toLowerCase()];
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
    const res = fs.readFileSync(promptfile.value, 'utf8');
    return res
}

async function processOutput(res: string) {
    //console.log("MODE", inputMode.value);
    //console.log("OUTPUT", res);
    if (outputMode.value == "clipboard") {
        //console.log("Writing to kb", res)
        await writeToClipboard(res);
    }
}

export {
    readPromptFile,
    processOutput,
    setOptions,
}