import { Command } from "@commander-js/extra-typings";
import { Cmd, FeatureType } from "../interfaces.js";
import { formatMode, initFeatures, lastCmd, runMode } from "../state/state.js";
import { modes } from "./options/modes.js";
import { executeTaskCmd } from "./lib/execute_task.js";
import { clearOutput, initAgent, marked, taskReader } from "../agent.js";
import { executeActionCmd } from "./lib/execute_action.js";
import { executeJobCmd, readJob } from "./lib/execute_job.js";
import { readCmds } from "./sys/read_cmds.js";
import { processOutput, setOptions } from "./lib/utils.js";
import { getFeatureSpec, readFeaturesDirs } from "../state/features.js";
import { readFeatures } from "../db/read.js";
import { insertFeaturesPathIfNotExists, insertPluginIfNotExists, updateFeatures } from "../db/write.js";
import { readConf } from "./sys/read_conf.js";
import { buildPluginsPaths } from "../state/plugins.js";

let cmds: Record<string, Cmd> = {
    q: {
        cmd: async () => process.exit(0),
        description: "exit the cli"
    },
    ping: {
        cmd: async () => await initAgent(runMode.value),
        description: "Ping inference servers",
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
    /*addfeat: {
        cmd: _addFeaturesPathCmd,
        description: "add a features path",
        args: "arguments: \n-path (required): the absolute path to the features directory"
    },
    addplugin: {
        cmd: _addPluginCmd,
        description: "add a plugin",
        args: "arguments: \n-name (required): the name of the plugin npm package"
    },*/
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

let cliCmds = { ...cmds, ...modes };

async function initCmds() {
    //console.log("CMDS", feats.cmds)
    for (const dirpath of new Set(Object.values(readFeatures().cmd))) {
        //console.log("Reading cmds in", dirpath);
        const c = await readCmds(`${dirpath}`);
        //console.log("Found cmds:", c);
        cmds = { ...cmds, ...c }
    }
    /*const userCmds = await readCmds(cmdsPath);
    for (const [k, v] of Object.entries(userCmds)) {
        cmds[k] = v
    }*/
    cliCmds = { ...cmds, ...modes }
    //console.log("CMDS", cmds);
}

/*async function _addFeaturesPathCmd(args: Array<string> = [], options: any): Promise<any> {
    if (args.length == 0) {
        console.warn("Provide a path");
        return
    }
    const alreadyExists = insertFeaturesPathIfNotExists(args[0]);
    if (alreadyExists) {
        console.warn("The features path already exists");
        return
    }
    console.log("Features path inserted");
}

async function _addPluginCmd(args: Array<string> = [], options: any): Promise<any> {
    if (args.length == 0) {
        console.warn("Provide a package name");
        return
    }
    const alreadyExists = insertPluginIfNotExists(args[0]);
    if (alreadyExists) {
        console.warn("The plugin already exists");
        return
    }
    console.log("Plugin inserted");
}*/

async function _updateFeaturesCmd(args: Array<string> = [], options: any): Promise<any> {
    await initFeatures();
    console.log("Features updated")
}

async function _updateConfCmd(args: Array<string> = [], options: any): Promise<any> {
    if (args.length == 0) {
        console.warn("Provide a config.yml file path");
        return
    }
    const { found, data } = readConf(args[0]);
    if (!found) {
        console.warn(`Config file ${args[0]} not found`);
    }
    const p = new Array<string>();
    //console.log(data)
    if ("features" in data) {
        p.push(...data.features);
        const fts = new Array<string>();
        data.features.forEach((f) => {
            if (!fts.includes(f)) {
                insertFeaturesPathIfNotExists(f);
                fts.push(f)
            }
        });
    }
    if ("plugins" in data) {
        const plugins = await buildPluginsPaths(data.plugins);
        plugins.forEach((_pl) => {
            p.push(_pl.path);
            insertPluginIfNotExists(_pl.name, _pl.path);
        });
    }
    const feats = readFeaturesDirs(p);
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
    clearOutput();
    if (formatMode.value == "markdown") {
        console.log((marked.parse(data) as string).trim())
    } else {
        console.log(data)
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
    const t = await executeJobCmd(name, args);
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
    }
    const t = taskReader.read(path);
    console.log(t);
}

async function _listTasksCmd(args: Array<string> = [], options: any): Promise<any> {
    Object.keys(readFeatures().task).forEach((t) => console.log("-", t));
}

async function runCmd(cmdName: string, args: Array<string> = []) {
    if (!(cmdName in cliCmds)) {
        console.log(`Command ${cmdName} not found`);
        return
    }
    const cmd = cliCmds[cmdName].cmd;
    //console.log("Running cmd", cmds[cmdName]);
    await cmd(args, {});
    lastCmd.name = cmdName;
    /*if (inputMode.value != "manual") {
        args.pop()
    }*/
    lastCmd.args = args;
}

async function buildCmds(): Promise<Command> {
    const program = new Command();
    for (const [name, spec] of Object.entries(cmds)) {
        const cmd = program.command(name);
        const _cmd = async (args: Array<string> = [], options: any = {}): Promise<any> => {
            //console.log("CMD OPTS", options);
            const _args = await setOptions(options, args);
            const res = await spec.cmd(_args, options);
            await processOutput(res);
            return res
        }
        if ("args" in spec) {
            cmd
                .argument("<args...>", spec.args)
                .description(spec.description)
                .action(_cmd);
        } else {
            cmd
                .argument("[args...]", "No arguments")
                .description(spec.description)
                .action(_cmd);
        }
        for (const [_name, _spec] of Object.entries(modes)) {
            //if (name == "et") {
            //console.log("Add option", _name);
            cmd.option(_name, _spec.description)
            //}
        }
    }
    return program
}

async function parseCmd() {
    const program = await buildCmds();
    await program.parseAsync();
}

export { initCmds, runCmd, buildCmds, parseCmd }