import { Command, Option } from "commander";
import { listBackends, setBackend } from "../../state/backends.js";
import { parseCommandArgs } from "../lib/options_parsers.js";
import { processTaskCmd, processTasksCmd, resetDbCmd, updateFeaturesCmd } from "./cmds.js";
import { updateConfCmd } from "./updateconf.js";
import { displayOptions, inferenceOptions } from "../options.js";

function initBaseCommands(program: Command): Command {
    /*program.command("ping")
        .description("ping inference servers")
        .action(async (...args: Array<any>) => { console.log("Found working inference server(s):", await initAgent(initRemoteBackends())) });*/
    program.command("exit")
        .description("exit the cli")
        .action(() => process.exit(0));
    const tasksCmd = program.command("tasks")
        .description("list all the tasks")
        .action(async (...args: Array<any>) => {
            const ca = parseCommandArgs(args);
            await processTasksCmd(ca.args, ca.options)
        });
    tasksCmd.addOption(
        new Option("-c, --conf", "output the tasks config")
    )
    const taskCmd = program.command("task <task>")
        .description("read a task")
        .action(async (...args: Array<any>) => {
            const ca = parseCommandArgs(args);
            await processTaskCmd(ca.args, ca.options)
        });
    inferenceOptions.forEach(o => taskCmd.addOption(o));
    taskCmd.addOption(new Option("--reset", "reset the task config to the original"));
    program.command("backend <name>")
        .description("set the default backend")
        .action(async (...args: Array<any>) => {
            const ca = parseCommandArgs(args);
            await setBackend(ca.args[0])
        });
    program.command("backends")
        .description("list the available backends")
        .action(async (...args: Array<any>) => {
            await listBackends()
        });
    const updateCmd = program.command("update")
        .description("update the available features: run this after adding a new feature")
        .action(async (...args: Array<any>) => {
            const ca = parseCommandArgs(args);
            await updateFeaturesCmd(ca.options)
        });
    displayOptions.forEach(o => updateCmd.addOption(o));
    program.command("conf <path>")
        .description("process config file")
        .action(async (...args: Array<any>) => {
            const ca = parseCommandArgs(args);
            await updateConfCmd(ca.args)
        });
    program.command("reset")
        .description("reset the config database")
        .action(async (...args: Array<any>) => {
            await resetDbCmd()
        });
    return program
}



export {
    initBaseCommands
};
