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
    console.log("CHAT")
    const prompt = await input(data);
    console.log("CHAT INPUT", prompt)
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

async function parseCmd() {
    const program = await buildCmds();
    /*program.hook('preAction', (thisCommand, actionCommand) => {
        const options = actionCommand.opts();
        if (options?.chat === true) {
            isChatMode.value = true
        }
        console.log("OPTIONS", options);
    });*/
    await program.parseAsync();
    console.log("CHAT MODE", isChatMode.value);
    if (isChatMode.value) {
        await chat(program)
    }
}

export {
    buildCmds,
    chat,
    parseCmd,
};

