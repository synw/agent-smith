import { Cmd, FeatureType } from "../../interfaces.js";
import { formatMode, isChatMode, runMode } from "../../state/state.js";
import { getFeatureSpec, readFeaturesDirs } from "../../state/features.js";
import { readAliases, readFeatures } from "../../db/read.js";
import { cleanupFeaturePaths, updateAliases, updateFeatures } from "../../db/write.js";
import { processConfPath } from "../../conf.js";
import { executeActionCmd } from "../lib/execute_action.js";
import { brain, initAgent, marked, taskBuilder } from "../../agent.js";
import { executeJobCmd, readJob } from "../lib/execute_job.js";
import { executeTaskCmd } from "../lib/execute_task.js";
import { readCmds } from "../sys/read_cmds.js";
import { readTask } from "../lib/utils.js";

let cmds: Record<string, Cmd> = {
    q: {
        cmd: async () => process.exit(0),
        description: "exit the cli"
    },
    ping: {
        cmd: async () => pingCmd(["verbose"], undefined),
        description: "ping inference servers",
    },
    lt: {
        cmd: _listTasksCmd,
        description: "list all the tasks"
    },
    rt: {
        cmd: _readTaskCmd,
        description: "read a task",
        args: "arguments: \n-task (required): the task name"
    },
    rj: {
        cmd: _readJobCmd,
        description: "read a job",
        args: "arguments: \n-job (required): the job name"
    },
    t: {
        cmd: _executeTaskCmd,
        description: "execute a task",
        //args: "arguments: \n-task (required): the task name\n-args: prompt and other arguments if any for the task"
    },
    j: {
        cmd: _executeJobCmd,
        description: "execute a job",
        args: "arguments: \n-job (required): the job name\n-args: arguments if any for the job"
    },
    a: {
        cmd: executeActionCmd,
        description: "execute an action",
        args: "arguments: \n-action (required): the task name\n-args: other arguments if any for the action"
    },
    conf: {
        cmd: _updateConfCmd,
        description: "process config file",
        args: "arguments: \n-path (required): the path to the config.yml file"
    },
}

function initAliases(): Record<string, Cmd> {
    const aliases = readAliases();
    const _cmds: Record<string, Cmd> = {};
    aliases.forEach((alias) => {
        switch (alias.type) {
            case "task":
                _cmds[alias.name] = {
                    cmd: (args: Array<string> = [], options: any) => _executeTaskCmd([alias.name, ...args], options),
                    description: "task: " + alias.name,
                    //args: "arguments: \n-args: prompt and other arguments if any for the task"
                }
                break;
            case "action":
                _cmds[alias.name] = {
                    cmd: (args: Array<string> = [], options: any = {}, quiet = false) => executeActionCmd([alias.name, ...args], options, quiet),
                    description: "action: " + alias.name,
                    //args: "arguments: \n-args: other arguments if any for the action"
                }
                break;
            case "job":
                _cmds[alias.name] = {
                    cmd: (args: Array<string> = [], options: any) => _executeJobCmd([alias.name, ...args], options),
                    description: "job: " + alias.name,
                    //args: "arguments: \n-args: other arguments if any for the job"
                }
        }
    });
    return _cmds
}

async function initCmds(): Promise<Record<string, Cmd>> {
    //console.log("CMDS", feats.cmds)
    for (const dirpath of new Set(Object.values(readFeatures().cmd))) {
        //console.log("Reading cmds in", dirpath);
        const c = await readCmds(`${dirpath}`);
        //console.log("Found cmds:", c);
        cmds = { ...cmds, ...c }
    }
    return cmds
}

async function pingCmd(args: Array<string> = [], options: any): Promise<boolean> {
    const isUp = await initAgent(true);
    //console.log(brain.backends);
    return isUp
}

async function _updateConfCmd(args: Array<string> = [], options: any): Promise<any> {
    if (args.length == 0) {
        console.warn("Provide a config.yml file path");
        return
    }
    const allPaths = await processConfPath(args[0]);
    const feats = readFeaturesDirs(allPaths);
    //console.log("CMD FEATS", feats);
    updateFeatures(feats);
    updateAliases(feats);
    const deleted = cleanupFeaturePaths(allPaths);
    for (const el of deleted) {
        console.log("- [feature path]", el)
    }
}

async function _readJobCmd(args: Array<string> = [], options: any): Promise<any> {
    if (args.length == 0) {
        console.warn("Provide a job name");
        return
    }
    const t = await readJob(args[0]);
    console.log(t.data);
}

async function _executeTaskCmd(args: Array<string> = [], options: any): Promise<any> {
    //console.log("ETA", args);
    if (args.length == 0) {
        console.warn("Provide a task name");
        return
    }
    const { ok, data, conf, error } = await executeTaskCmd(args, options);
    if (!ok) {
        console.warn(error)
    }
    if (formatMode.value == "markdown") {
        console.log("\n------------------\n");
        console.log((marked.parse(data) as string).trim())
    } else {
        console.log()
    }
    if (isChatMode.value) {

    }
    //console.log("ENDRES", data);
    return data
}

async function _executeJobCmd(args: Array<string> = [], options: any): Promise<any> {
    if (args.length == 0) {
        console.warn("Provide a job name");
        return
    }
    const name = args.shift()!;
    const res = await executeJobCmd(name, args, options);
    return res
    //console.log("ENDRES", t);
}

async function _readTaskCmd(args: Array<string> = [], options: any): Promise<any> {
    if (args.length == 0) {
        console.warn("Provide a task name");
        return
    }
    const { found, path } = getFeatureSpec(args[0], "task" as FeatureType);
    if (!found) {
        console.warn(`FeatureType ${args[0]} not found`)
        return
    }
    const res = readTask(path);
    if (!res.found) {
        throw new Error(`Task ${args[0]}, ${path} not found`)
    }
    const ts = taskBuilder.readFromYaml(res.ymlTask);
    console.log(JSON.stringify(ts, null, "  "));
}

async function _listTasksCmd(args: Array<string> = [], options: any): Promise<any> {
    Object.keys(readFeatures().task).forEach((t) => console.log("-", t));
}

export { cmds, initCmds, pingCmd, initAliases }