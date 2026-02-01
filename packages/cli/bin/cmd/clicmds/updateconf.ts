import path from "path";
import { processConfPath } from "../../conf.js";
import { initDb } from "../../db/db.js";
import { readFeaturePaths, readFilePath } from "../../db/read.js";
import { cleanupFeaturePaths, updateAliases, updateDataDirPath, updateFeatures, updatePromptfilePath, upsertFilePath } from "../../db/write.js";
import type { Features } from "../../interfaces.js";
import { readFeaturesDirs } from "../../state/features.js";
import { readPluginsPaths } from "../../state/plugins.js";
import { dataDirPath, promptfilePath } from "../../state/state.js";
import { runtimeDataError, runtimeInfo } from '../lib/user_msgs.js';
import { readUserCmd } from "../sys/read_cmds.js";

async function getUserCmdsData(feats: Features): Promise<Features> {
    for (const feat of feats.cmd) {
        const cmdPath = path.join(feat.path, feat.name + "." + feat.ext);
        const { found, userCmd } = await readUserCmd(feat.name, cmdPath);
        if (found) {
            feat.variables = {
                description: userCmd.description,
                name: userCmd.name,
            }
            if (userCmd?.options) {
                feat.variables.options = userCmd.options
            }
        }
    }
    return feats
}

async function updateAllFeatures(paths: Array<string>) {
    let feats = readFeaturesDirs(paths, true);
    feats = await getUserCmdsData(feats);
    updateFeatures(feats);
    updateAliases(feats);
    const deleted = cleanupFeaturePaths(paths);
    for (const el of deleted) {
        console.log("- [feature path]", el)
    }
}

async function updateFeaturesCmd(options: Record<string, any>): Promise<any> {
    const fp = readFeaturePaths();
    const pp = await readPluginsPaths();
    const paths = [...fp, ...pp];
    updateAllFeatures(paths)
}

async function updateConfCmd(args: Array<string>): Promise<any> {
    initDb(false, true);
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
    updateAllFeatures(paths);
}

export {
    updateConfCmd,
    updateFeaturesCmd,
}