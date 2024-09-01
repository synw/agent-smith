import { Cmd, FeatureType } from "../../interfaces.js";
import { formatMode, initFeatures, runMode } from "../../state/state.js";
import { getFeatureSpec, readFeaturesDirs } from "../../state/features.js";
import { readFeatures } from "../../db/read.js";
import { updateFeatures } from "../../db/write.js";
import { updateConf } from "../../conf.js";
import { executeActionCmd } from "../lib/execute_action.js";
import { initAgent, marked, taskBuilder } from "../../agent.js";
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
        args: "arguments: \n-task (required): the task name\n-args: prompt and other arguments if any for the task"
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
    update: {
        cmd: _updateFeaturesCmd,
        description: "reparse the features dirs and update the list",
    }
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
    let _isVerbose = false;
    if (args.length > 0) {
        _isVerbose = args[0] == "verbose"
    }
    const isUp = await initAgent(runMode.value, _isVerbose);
    return isUp
}

async function _updateFeaturesCmd(args: Array<string> = [], options: any): Promise<any> {
    await initFeatures();
    console.log("Features updated")
}

async function _updateConfCmd(args: Array<string> = [], options: any): Promise<any> {
    if (args.length == 0) {
        console.warn("Provide a config.yml file path");
        return
    }
    const allPaths = await updateConf(args[0]);
    const feats = readFeaturesDirs(allPaths);
    //console.log("CMD FEATS", feats);
    updateFeatures(feats);
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
    const { ok, data, error } = await executeTaskCmd(args);
    if (!ok) {
        console.warn(error)
    }
    if (formatMode.value == "markdown") {
        console.log("\n\n------------------\n");
        console.log((marked.parse(data) as string).trim())
    } else {
        console.log()
    }
    return data
    //console.log("ENDRES", t);
}

async function _executeJobCmd(args: Array<string> = [], options: any): Promise<any> {
    if (args.length == 0) {
        console.warn("Provide a job name");
        return
    }
    const name = args.shift()!;
    const res = await executeJobCmd(name, args);
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
    const ts = taskBuilder.readFromYaml(path);
    console.log(ts);
}

async function _listTasksCmd(args: Array<string> = [], options: any): Promise<any> {
    Object.keys(readFeatures().task).forEach((t) => console.log("-", t));
}

export { cmds, initCmds, pingCmd }