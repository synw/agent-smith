import { default as fs } from "fs";
import { default as path } from "path";
import { outputMode, promptfile } from "../../state/state.js";
import { inputMode, runMode } from "../../state/state.js";
import { readClipboard, writeToClipboard } from "../sys/clipboard.js";
import { modes } from "../clicmds/modes.js";

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

async function processOutput(res: any) {
    if (!(outputMode.value == "clipboard")) { return }
    let data = "";
    //console.log("Process OUTPUT", typeof res, res);
    if (typeof res == "object") {
        let hasOutput = false;
        if (res?.data) {
            data = res.data;
            hasOutput = true;
        }
        if (res?.text) {
            data = res.text;
            hasOutput = true;
        }
        if (!hasOutput) {
            throw new Error(`No data in res: ${JSON.stringify(res, null, "  ")}`);
        }
    } else {
        data = res;
    }
    //console.log("MODE", inputMode.value);
    //console.log("OUTPUT", typeof res, res);
    if (outputMode.value == "clipboard") {
        //console.log("Writing to kb", res)
        await writeToClipboard(data);
    }
}

function readTask(taskpath: string): { found: boolean, ymlTask: string } {
    if (!fs.existsSync(taskpath)) {
        return { ymlTask: "", found: false }
    }
    const data = fs.readFileSync(taskpath, 'utf8');
    return { ymlTask: data, found: true }
}

function readTasksDir(dir: string): Array<string> {
    const tasks = new Array<string>();
    fs.readdirSync(dir).forEach((filename) => {
        const filepath = path.join(dir, filename);
        const isDir = fs.statSync(filepath).isDirectory();
        if (!isDir) {
            if (filename.endsWith(".yml")) {
                tasks.push(filename)
            }
        }
    });
    return tasks
}

function initTaskVars(args: Array<any>): { conf: Record<string, any>, vars: Record<string, any> } {
    const conf: Record<string, any> = {};
    const vars: Record<string, any> = {};
    args.forEach((a) => {
        if (a.includes("=")) {
            const t = a.split("=");
            const k = t[0];
            const v = t[1];
            //vars[t[0]] = t[1];
            if (k == "m") {
                if (v.includes("/")) {
                    const _s = v.split("/");
                    conf.model = _s[0];
                    conf.template = _s[1];
                } else {
                    conf.model = v
                }
            } else if (k == "ip") {
                const ip: Record<string, any> = {};
                v.split(",").forEach((p: string) => {
                    const s = p.split(":");
                    ip[s[0]] = parseFloat(s[1])
                });
                conf.inferParams = ip
            } else {
                vars[k] = v
            }
        }
    });
    return { conf, vars }
}

export {
    readPromptFile,
    processOutput,
    setOptions,
    readTask,
    readTasksDir,
    initTaskVars,
}