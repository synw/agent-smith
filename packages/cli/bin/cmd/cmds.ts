import { input } from "@inquirer/prompts";
import { toRaw } from "@vue/reactivity";
import { Command } from "commander";
import { brain } from "../agent.js";
import { query } from "../cli.js";
import { Cmd } from "../interfaces.js";
import { chatInferenceParams } from "../state/chat.js";
import { isChatMode, lastCmd, runMode } from "../state/state.js";
import { cmds, initAliases, initCmds } from "./clicmds/cmds.js";
import { modes } from "./clicmds/modes.js";
import { processOutput, setOptions } from "./lib/utils.js";

let cliCmds: Record<string, Cmd> = {};

async function chat() {
    const data = { message: '>', default: "" };
    const prompt = await input(data);
    if (prompt == "/q") {
        isChatMode.value = false;
        if (runMode.value == "cmd") {
            process.exit(0)
        } else {
            await query()
        }
    }
    //console.log("EX", brain.ex);
    await brain.ex.think(prompt, toRaw(chatInferenceParams));
    console.log();
    await chat();
}

async function initCliCmds() {
    const _cmds = await initCmds();
    const _alias = initAliases();
    cliCmds = { ..._cmds, ..._alias }
}

async function runCmd(cmdName: string, args: Array<string> = [], options: any = {}) {
    if (!(cmdName in cliCmds)) {
        console.log(`Command ${cmdName} not found`);
        return
    }
    const cmd = cliCmds[cmdName].cmd;
    //console.log("Running cmd", cmds[cmdName]);
    await cmd(args, options);
    lastCmd.name = cmdName;
    lastCmd.args = args;
}

async function buildCmds(): Promise<Command> {
    const program = new Command();
    const aliases = initAliases();
    const excmds = await initCmds();
    for (const [name, spec] of Object.entries({ ...cmds, ...excmds, ...aliases })) {
        //console.log("N", name, "S", spec);
        const cmd = program.command(name);
        const _cmd = async (args: Array<string> = [], options: any = {}): Promise<any> => {
            //console.log("CMD OPTS", options);
            //console.log("BARGS", args);
            const _args = await setOptions(args, options);
            //console.log("FARGS", _args, options);
            const res = await spec.cmd(_args, options);
            //console.log("CMD RES", res);
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
    if (isChatMode.value) {
        await chat()
    }
}

export { buildCmds, chat, initCliCmds, parseCmd, runCmd };
