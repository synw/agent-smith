import { AgentTask } from "@agent-smith/jobs/dist/jobsinterfaces.js";
import { useAgentTask } from "@agent-smith/jobs";
import { LmTask } from "@agent-smith/lmtask";
import { useTemplateForModel } from "@agent-smith/tfm";
import { default as fs } from "fs";
import { default as path } from "path";
import { Cmd, FeatureType } from "../../interfaces.js";
import { inputMode, outputMode, promptfile } from "../../state/state.js";
import { modes } from "../clicmds/modes.js";
import { readClipboard, writeToClipboard } from "../sys/clipboard.js";

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
    try {
        return fs.readFileSync(promptfile.value, 'utf8');
    } catch (e) {
        return ""
    }
}

async function processOutput(res: any) {
    if (!(outputMode.value == "clipboard")) { return }
    let data = "";
    //console.log("Process OUTPUT", typeof res, res);
    if (typeof res == "object") {
        let hasOutput = false;
        if (res?.data) {
            data = res.data; 0
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
        if (typeof data == "object") {
            data = JSON.stringify(data)
        }
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

function initTaskConf(conf: Record<string, any>, taskSpec: LmTask): Record<string, any> {
    const _conf = conf;
    let m = taskSpec.model.name;
    let t: string = taskSpec.model.template;
    let c = taskSpec.model.ctx;
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
            c = taskSpec.models[conf.size].ctx;
        }
    }
    _conf.model = {
        name: m,
        template: t,
        ctx: c,
    };
    if (_conf?.template) {
        delete conf.template
    }
    return _conf
}

function initTaskParams(params: Record<string, any>, inferParams: Record<string, any>): { conf: Record<string, any>, vars: Record<string, any> } {
    //console.log("TASK PARAMS", params);
    const conf: Record<string, any> = { inferParams: inferParams };
    if (!params?.prompt) {
        throw new Error(`Error initializing task variable: provide a prompt`)
    }
    if (params?.images) {
        conf.inferParams.images = params.images;
        delete params.images;
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
            const t = a.split("=");
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

function createJsAction(action: CallableFunction): AgentTask<FeatureType> {
    const task = useAgentTask<FeatureType>({
        id: "",
        title: "",
        run: async (args) => {
            const res = await action(args);
            return { ok: true, data: res }
        }
    });
    return task
}

export {
    createJsAction, initTaskConf,
    initTaskParams, initTaskVars, parseInputOptions, processOutput, readPromptFile, readTask,
    readTasksDir, setOptions
};
