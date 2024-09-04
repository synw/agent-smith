import { Command } from "commander";
import { lastCmd } from "../state/state.js";
import { modes } from "./clicmds/modes.js";
import { processOutput, setOptions } from "./lib/utils.js";
import { cmds, initAliases, initCmds } from "./clicmds/cmds.js";
import { Cmd } from "bin/interfaces.js";

let cliCmds: Record<string, Cmd> = {};

async function initCliCmds() {
    cliCmds = await initCmds()
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
    const aliases = initAliases();
    for (const [name, spec] of Object.entries({ ...cmds, ...aliases })) {
        const cmd = program.command(name);
        const _cmd = async (args: Array<string> = [], options: any = {}): Promise<any> => {
            //console.log("CMD OPTS", options);
            const _args = await setOptions(options, args);
            const res = await spec.cmd(_args, options);
            //console.log("RES", res);
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

export { runCmd, buildCmds, parseCmd, initCliCmds }