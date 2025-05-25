import { input } from "@inquirer/prompts";
import { toRaw } from "@vue/reactivity";
import { Command } from "commander";
import { brain } from "../agent.js";
import { query } from "../cli.js";
import { readAliases, readFeatures } from "../db/read.js";
import { chatInferenceParams } from "../state/chat.js";
import { isChatMode, runMode } from "../state/state.js";
import { initCommandsFromAliases } from "./clicmds/aliases.js";
import { initBaseCommands } from "./clicmds/base.js";
import { initUserCmds } from "./clicmds/cmds.js";

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
    await brain.ex.think(prompt, toRaw(chatInferenceParams));
    console.log();
    await chat(program);
}

async function buildCmds(): Promise<Command> {
    const program = new Command();
    initBaseCommands(program);
    const aliases = readAliases();
    initCommandsFromAliases(program, aliases);
    const feats = readFeatures();
    const cmds = await initUserCmds(feats.cmd);
    cmds.forEach(c => {
        //console.log("Add cmd", c);
        program.addCommand(c)
    });
    return program
}

async function parseCmd(program: Command) {
    await program.parseAsync();
    if (isChatMode.value) {
        await chat(program)
    }
}

export {
    buildCmds,
    chat,
    parseCmd,
};

