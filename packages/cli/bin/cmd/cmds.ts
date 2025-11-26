import { input } from "@inquirer/prompts";
import { toRaw } from "@vue/reactivity";
import { Command } from "commander";
import { query } from "../cli.js";
import { readAliases, readFeatures } from "../db/read.js";
import { chatInferenceParams } from "../state/chat.js";
import { agent, isChatMode, runMode } from "../state/state.js";
import { initCommandsFromAliases } from "./clicmds/aliases.js";
import { initBaseCommands } from "./clicmds/base.js";
import { initUserCmds } from "./clicmds/cmds.js";

const program = new Command();

async function chat(program: Command) {
    const data = { message: '>', default: "" };
    const prompt = await input(data);
    if (prompt == "/q") {
        isChatMode.value = false;
        if (runMode.value == "cmd") {
            process.exit(0)
        } else {
            await query(program)
        }
    }
    //console.log("EX", brain.ex);
    await agent.lm.infer(prompt, toRaw(chatInferenceParams))
    console.log();
    await chat(program);
}

async function buildCmds(): Promise<Command> {
    //program.allowUnknownOption(true);
    initBaseCommands(program);
    const aliases = readAliases();
    const feats = readFeatures();
    initCommandsFromAliases(program, aliases, feats);
    const cmds = await initUserCmds(feats.cmd);
    cmds.forEach(c => {
        //console.log("Add cmd", c.name());
        program.addCommand(c)
    });
    return program
}

async function parseCmd(program: Command) {
    program.name('Agent Smith terminal client');
    program.description('Terminal agents toolkit');
    await program.parseAsync();
    /*if (isChatMode.value) {
        await chat(program)
    }*/
}

export {
    program,
    buildCmds,
    chat,
    parseCmd,
};

