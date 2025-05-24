import { Command } from 'commander';
import { processConfPath } from "../../conf.js";
import { initDb } from "../../db/db.js";
import { readFilePath } from "../../db/read.js";
import { cleanupFeaturePaths, updateAliases, updateDataDirPath, updateFeatures, updatePromptfilePath, upsertFilePath } from "../../db/write.js";
import { readFeaturesDirs } from "../../state/features.js";
import { dataDirPath, isDebug, promptfilePath } from "../../state/state.js";
import { updateAllModels } from '../lib/models.js';
import { runtimeDataError, runtimeInfo } from '../lib/user_msgs.js';
import { readCmds } from "../sys/read_cmds.js";

async function initUserCmds(cmdFeats: Record<string, string>): Promise<Array<Command>> {
    //console.log("CMDS", feats.cmds)
    const cmds = new Array<Command>();
    for (const dirpath of new Set(Object.values(cmdFeats))) {
        //console.log("Reading cmds in", dirpath);
        const c = await readCmds(`${dirpath}`);
        cmds.push(...c)
    }
    return cmds
}

async function updateConfCmd(args: Array<string>): Promise<any> {
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

export {
    initUserCmds,
    updateConfCmd
};
