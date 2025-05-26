import { Command } from "commander";
import YAML from 'yaml';
import { initAgent, taskBuilder } from "../../agent.js";
import { dbPath, processConfPath } from "../../conf.js";
import { readFeaturePaths, readFeatures, readFeaturesType, readFilePath } from "../../db/read.js";
import { cleanupFeaturePaths, updateAliases, updateDataDirPath, updateFeatures, updatePromptfilePath, upsertFilePath } from "../../db/write.js";
import { FeatureType } from "../../interfaces.js";
import { getFeatureSpec, readFeaturesDirs } from "../../state/features.js";
import { readPluginsPaths } from "../../state/plugins.js";
import { dataDirPath, promptfilePath, runMode } from "../../state/state.js";
import { showModelsCmd, updateAllModels } from "../lib/models.js";
import { parseCommandArgs } from "../lib/options_parsers.js";
import { deleteFileIfExists } from "../sys/delete_file.js";
import { readTask } from "../sys/read_task.js";
import { initDb } from "../../db/db.js";
import { runtimeDataError } from "../../utils/user_msgs.js";
import { runtimeInfo } from "../../utils/user_msgs.js";
import { updateConfCmd } from "./update.js";

function initBaseCommands(program: Command): Command {
    program.command("ping")
        .description("ping inference servers")
        .action(async (...args: Array<any>) => { console.log("Found working inference server(s):", await initAgent()) });
    program.command("exit")
        .description("exit the cli")
        .action(() => process.exit(0));
    program.command("tasks")
        .description("list all the tasks")
        .action(async (...args: Array<any>) => {
            const ts = Object.keys(readFeaturesType("task")).sort();
            console.table(ts)
        });
    program.command("task <task>")
        .description("read a task")
        .action(async (...args: Array<any>) => {
            const ca = parseCommandArgs(args);
            await _readTaskCmd(ca.args)
        });
    program.command("models [filters...]")
        .description("list the available models")
        .action(async (...args: Array<any>) => {
            const ca = parseCommandArgs(args);
            await showModelsCmd(ca.args)
        });
    program.command("update")
        .description("update the available features: run this after adding a new feature")
        .action(async (...args: Array<any>) => {
            await _updateFeatures()
        });
    program.command("conf <path>")
        .description("process config file")
        .action(async (...args: Array<any>) => {
            const ca = parseCommandArgs(args);
            await updateConfCmd(ca.args)
        });
    program.command("reset")
        .description("reset the config database")
        .action(async (...args: Array<any>) => {
            await _resetDbCmd()
        });
    return program
}

async function _resetDbCmd(): Promise<any> {
    if (runMode.value == "cli") {
        console.log("This command can not be run in cli mode")
        return
    }
    deleteFileIfExists(dbPath);
    console.log("Config database reset ok. Run the conf command to recreate it")
}

async function _updateFeatures(): Promise<any> {
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

async function _readTaskCmd(args: Array<string>): Promise<any> {
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

export {
    initBaseCommands
};
