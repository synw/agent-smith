import YAML from 'yaml';
import { initAgent, taskBuilder } from "../../agent.js";
import { processConfPath } from "../../conf.js";
import { dbPath, initDb } from "../../db/db.js";
import { readFeaturePaths, readFeatures, readFilePath } from "../../db/read.js";
import { cleanupFeaturePaths, updateAliases, updateDataDirPath, updateFeatures, updatePromptfilePath, upsertFilePath } from "../../db/write.js";
import { Cmd, FeatureType } from "../../interfaces.js";
import { getFeatureSpec, readFeaturesDirs } from "../../state/features.js";
import { readPluginsPaths } from '../../state/plugins.js';
import { dataDirPath, isDebug, promptfilePath, runMode } from "../../state/state.js";
import { showModelsCmd, updateAllModels } from '../lib/models.js';
import { runtimeDataError, runtimeInfo } from '../lib/user_msgs.js';
import { deleteFileIfExists } from "../sys/delete_file.js";
import { readCmds } from "../sys/read_cmds.js";
import { readTask } from "../sys/read_task.js";

let cmds: Record<string, Cmd> = {
    exit: {
        cmd: async () => process.exit(0),
        description: "exit the cli"
    },
    ping: {
        cmd: async () => pingCmd(["verbose"], undefined),
        description: "ping inference servers",
    },
    tasks: {
        cmd: _listTasksCmd,
        description: "list all the tasks"
    },
    task: {
        cmd: _readTaskCmd,
        description: "read a task",
        args: "arguments: \n-task (required): the task name"
    },
    models: {
        cmd: showModelsCmd,
        description: "list the available models",
    },
    update: {
        cmd: _updateFeatures,
        description: "update the available features: run this after adding a new feature",
    },
    conf: {
        cmd: updateConfCmd,
        description: "process config file",
        args: "arguments: \n-path (required): the path to the config.yml file"
    },
    reset: {
        cmd: _resetDbCmd,
        description: "reset the config database",
        //args: "arguments: \n-path (required): the path to the config.yml file"
    },
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
    const isUp = await initAgent();
    //console.log(brain.backends);
    return isUp
}

async function _updateFeatures(args: Array<string> = [], options: any): Promise<any> {
    const fp = readFeaturePaths();
    const pp = await readPluginsPaths();
    const paths = [...fp, ...pp];
    const feats = readFeaturesDirs(paths);
    //console.log("CMD FEATS", feats);
    updateFeatures(feats);
    updateAliases(feats);
    const deleted = cleanupFeaturePaths(paths);
    for (const el of deleted) {
        console.log("- [feature path]", el)
    }
}

async function updateConfCmd(args: Array<string> = [], options: any): Promise<any> {
    initDb(isDebug.value, true);
    // try to find a conf path in db
    const { found, path } = readFilePath("conf");
    const userProvidedConfPath = (args[0] != "conf") ? args[0] : null;
    if (!found && !userProvidedConfPath) {
        runtimeDataError("conf file path not found in db: please provide a conf path parameter to the command")
    }

    let confPath: string;
    if (userProvidedConfPath) {
        confPath = userProvidedConfPath;
        const isu = upsertFilePath("conf", confPath);
        if (isu) {
            runtimeInfo("Config path", confPath, "updated")
        }
    } else {
        confPath = path;
    }
    console.log("Using", confPath, "to update features");
    const { paths, pf, dd } = await processConfPath(confPath);
    if (pf.length > 0) {
        updatePromptfilePath(pf);
        promptfilePath.value = pf;
    }
    if (dd.length > 0) {
        updateDataDirPath(dd);
        dataDirPath.value = dd;
    }
    const feats = readFeaturesDirs(paths);
    //console.log("CMD FEATS", feats);
    updateFeatures(feats);
    updateAliases(feats);
    updateAllModels();
    const deleted = cleanupFeaturePaths(paths);
    for (const el of deleted) {
        console.log("- [feature path]", el)
    }
}

async function _resetDbCmd(args: Array<string> = [], options: any): Promise<any> {
    if (runMode.value == "cli") {
        console.log("This command can not be run in cli mode")
        return
    }
    deleteFileIfExists(dbPath);
    console.log("Config database reset ok. Run the conf command to recreate it")
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
    //console.log("RT", path)
    const res = readTask(path);
    if (!res.found) {
        throw new Error(`Task ${args[0]}, ${path} not found`)
    }
    const ts = taskBuilder.readFromYaml(res.ymlTask);
    console.log(YAML.stringify(ts))
    //console.log(JSON.stringify(ts, null, "  "));
}

async function _listTasksCmd(args: Array<string> = [], options: any): Promise<any> {
    const ts = Object.keys(readFeatures().task).sort();
    //.forEach((t) => console.log("-", t))
    console.table(ts)
}

export {
    cmds,
    initCmds,
    pingCmd,
    updateConfCmd
};
