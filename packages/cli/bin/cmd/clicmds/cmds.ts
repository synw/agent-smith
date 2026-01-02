import colors from "ansi-colors";
import { Command } from 'commander';
import path from "path";
import { pathToFileURL } from 'url';
import YAML from 'yaml';
import { cacheFilePath, dbPath } from "../../conf.js";
import { readFeaturePaths, readFeaturesType, readTaskSetting } from "../../db/read.js";
import { cleanupFeaturePaths, deleteTaskSetting, updateAliases, updateFeatures, upsertTaskSettings } from "../../db/write.js";
import { FeatureSpec, FeatureType } from '../../interfaces.js';
import { getFeatureSpec, readFeaturesDirs } from "../../state/features.js";
import { readPluginsPaths } from "../../state/plugins.js";
import { runMode } from "../../state/state.js";
import { initTaskSettings, isTaskSettingsInitialized, tasksSettings } from '../../state/tasks.js';
import { cmds } from "../../state/auto/usercmds.js";
import { deleteFileIfExists } from "../sys/delete_file.js";
import { readCmd } from "../sys/read_cmds.js";
import { readTask } from "../sys/read_task.js";
import { updateUserCmdsCache } from './cache.js';

async function initUserCmds(cmdFeats: Record<string, FeatureSpec>): Promise<Array<Command>> {
    const features = Object.values(cmdFeats);
    if (features.length == 0) {
        return []
    }
    let endCmds: Array<Command> = cmds;
    if (cmds.length == 0) {
        //console.log("Sync user cmds:", features.length, cmds.length);
        // user commands are not sync
        updateUserCmdsCache(cacheFilePath, features);
        const url = pathToFileURL(cacheFilePath).href;
        //console.log("IMPORT CACHE", url);
        //const usrCmds = await import(url);
        const usrCmds = new Array<Command>();
        for (const feat of features) {
            const cmdPath = path.join(feat.path, feat.name + "." + feat.ext);
            const c = await readCmd(feat.name, cmdPath);
            usrCmds.push(c)
        }
        //console.log("USRCMDS", usrCmds);
        endCmds = usrCmds;
    }
    return endCmds
}

/*async function initUserCmds(cmdFeats: Record<string, FeatureSpec>): Promise<Array<Command>> {
    const userCmdsPath = path.join(confDir, "usercmds.js");
    const url = pathToFileURL(userCmdsPath).href;
    try {
        const perf = usePerfTimer();
        const { cmds } = await import(url);
        perf.final("import user cmds")
        return cmds as Array<Command>
    } catch (err) {
        ensureUserCmdsCacheFileExists();
        return new Array<Command>()
    }
}*/

async function resetDbCmd(): Promise<any> {
    if (runMode.value == "cli") {
        console.log("This command can not be run in cli mode")
        return
    }
    deleteFileIfExists(dbPath);
    console.log("Config database reset ok. Run the conf command to recreate it")
}

async function updateFeaturesCmd(): Promise<any> {
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
    updateUserCmdsCache(cacheFilePath, feats.cmd)
}

async function processTasksCmd(args: Array<string>, options: Record<string, any>) {
    if (options?.conf) {
        if (!isTaskSettingsInitialized.value) {
            initTaskSettings()
        }
        //console.log("PTS", tasksSettings);
        console.log(YAML.stringify({ "tasks": tasksSettings }));
    } else {
        const ts = Object.keys(readFeaturesType("task")).sort();
        console.table(ts)
    }
}

async function processTaskCmd(args: Array<string>, options: Record<string, any>): Promise<any> {
    //console.log("TASK OPTS", options);
    if (args.length == 0) {
        console.warn("Provide a task name");
        return
    }
    const { found, path } = getFeatureSpec(args[0], "task" as FeatureType);
    if (!found) {
        console.warn(`Task ${args[0]} not found`)
        return
    }
    if (options?.reset) {
        deleteTaskSetting(args[0]);
        console.log("Task", args[0], "reset ok")
        return
    }
    //console.log("RT", path)
    const res = readTask(path);
    if (!res.found) {
        throw new Error(`Task ${args[0]}, ${path} not found`)
    }
    //const ts = JSON.parse(res.ymlTask);
    console.log(res.ymlTask);
    if (Object.keys(options).length > 0) {
        upsertTaskSettings(args[0], options);
    }
    const s = readTaskSetting(args[0]);
    if (s.found) {
        const sts = s.settings;
        delete sts.id;
        delete sts.name;
        const display: Record<string, any> = {}
        for (const [k, v] of Object.entries(sts)) {
            if (v) {
                display[k] = v
            }
        }
        console.log(colors.dim("Settings") + ":", display);
    }
    //console.log(JSON.stringify(ts, null, "  "));
}

export {
    initUserCmds, processTaskCmd,
    processTasksCmd, resetDbCmd,
    updateFeaturesCmd
};

