import { LmTask } from "@agent-smith/lmtask";
//import { LmTask } from "../../../../lmtask/dist/interfaces.js";
import { useTemplateForModel } from "@agent-smith/tfm";
import { Cmd, LmTaskFileSpec } from "../../interfaces.js";
import { inputMode, outputMode, promptfilePath } from "../../state/state.js";
import { modes } from "../clicmds/modes.js";
import { readClipboard, writeToClipboard } from "../sys/clipboard.js";
import { readFile } from "../sys/read.js";
import { InferenceStats } from "@locallm/types/dist/interfaces.js";

const tfm = useTemplateForModel();

async function setOptions(
    args: Array<string> = [], options: Record<string, any>,
): Promise<Array<string>> {
    //console.log("Args:", args);
    //console.log("Opts", options);
    /*if (runMode.value == "cli") {
        return args
    };*/
    //console.log("OPTIONS", options);
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
    return readFile(promptfilePath.value)
}

async function processOutput(res: any) {
    if (!(outputMode.value == "clipboard")) { return }
    let data = "";
    //console.log("Process OUTPUT", typeof res, res);
    if (typeof res == "object") {
        if (res?.answer?.text) {
            // lm task output
            data = res.answer.text;
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
        if (typeof data == "object") {
            data = JSON.stringify(data)
        }
        await writeToClipboard(data);
    }
}

/*function initTaskConf(conf: Record<string, any>, taskSpec: LmTaskFileSpec): Record<string, any> {
    const _conf = conf;
    let m = taskSpec.model.name;
    let t: string = taskSpec.model.template;
    let c = taskSpec.model?.ctx ?? defaultCtx;
    let ip = conf.inferParams;
    let system = taskSpec.model?.system;
    let assistant = taskSpec.model?.assistant;
    if (conf?.model) {
        m = conf.model;
        if (conf?.template) {
            t = conf.template
        } else {
            const gt = tfm.guess(m);
            if (gt == "none") {
                throw new Error(`Unable to guess the template for ${m}: please provide a template name"`)
            }
            t = gt
        }
    } else {
        if (conf?.size) {
            if (!taskSpec?.models) {
                throw new Error(`Model ${conf.size} not found in task`)
            }
            if (!Object.keys(taskSpec.models).includes(conf.size)) {
                throw new Error(`Model ${conf.size} not found in task`)
            }
            m = taskSpec.models[conf.size].name;
            t = taskSpec.models[conf.size].template;
            c = taskSpec.models[conf.size]?.ctx ?? taskSpec.ctx;
            if (taskSpec.models[conf.size]?.inferParams) {
                const tip = taskSpec.models[conf.size].inferParams as Record<string, any>;
                for (const [k, v] of Object.entries(tip)) {
                    ip[k] = v;
                }
            }
            system = taskSpec.models[conf.size]?.system;
            assistant = taskSpec.models[conf.size]?.assistant;
        }
    }
    _conf.model = {
        name: m,
        template: t,
        ctx: c,
    };
    if (system) {
        _conf.model.system = system;
    }
    if (assistant) {
        _conf.model.assistant = assistant
    }
    _conf.inferParams = ip;
    if (_conf?.template) {
        delete conf.template
    }
    //console.log("CONF", _conf);
    return _conf
}

function initTaskParams(params: Record<string, any>, inferParams: Record<string, any>): { conf: Record<string, any>, vars: Record<string, any> } {
    //console.log("TASK PARAMS", params);
    const conf: Record<string, any> = { inferParams: inferParams };
    if (!params?.prompt) {
        throw new Error(`Error initializing task params: provide a prompt`)
    }
    if (params?.images) {
        conf.inferParams.images = params.images;
        delete params.images;
    }
    if (params?.size) {
        conf.size = params.size;
        delete params.size;
    }
    if (params?.model) {
        conf.model = params.model;
        delete params.model;
    }
    if (params?.template) {
        conf.template = params.template;
        delete params.template;
    }
    const res = { conf: conf, vars: params };
    return res
}

function initTaskVars(args: Array<any>, inferParams: Record<string, any>): { conf: Record<string, any>, vars: Record<string, any> } {
    const conf: Record<string, any> = { inferParams: inferParams };
    const vars: Record<string, any> = {};
    //console.log("ARGS", args);
    args.forEach((a) => {
        if (a.includes("=")) {
            //const t = a.split("=");
            const delimiter = "=";
            const firstDelimiterIndex = a.indexOf(delimiter);
            let t = new Array<string>();
            if (firstDelimiterIndex !== -1) {
                t = [
                    a.slice(0, firstDelimiterIndex),
                    a.slice(firstDelimiterIndex + 1)
                ];
            } else {
                t = [a]; // If no delimiter is found, the whole string is the first element
            }
            //console.log("VSPLIT", t);
            const k = t[0];
            const v = t[1];
            switch (k) {
                case "m":
                    if (v.includes("/")) {
                        const _s = v.split("/");
                        conf.model = _s[0];
                        conf.template = _s[1];
                    } else {
                        conf.model = v;
                    }
                    break;
                case "ip":
                    v.split(",").forEach((p: string) => {
                        const s = p.split(":");
                        conf["inferParams"][s[0]] = parseFloat(s[1]);
                    });
                    break;
                case "s":
                    conf.size = v;
                    break;
                default:
                    vars[k] = v;
                    break;
            }
        }
    });
    return { conf, vars }
}*/

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
    //initTaskConf,
    //initTaskParams,
    //initTaskVars,
    parseInputOptions,
    processOutput,
    readPromptFile,
    setOptions,
    formatStats,
};
