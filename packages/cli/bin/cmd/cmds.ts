import { input } from "@inquirer/prompts";
import { InferenceOptions } from "@locallm/types/dist/inference.js";
import { Command } from "commander";
import { query } from "../cli.js";
import { readAliases, readFeatures } from "../db/read.js";
import { chatInferenceParams, chatTemplate } from "../state/chat.js";
import { isChatMode, runMode } from "../state/state.js";
import { initCommandsFromAliases } from "./clicmds/aliases.js";
import { initBaseCommands } from "./clicmds/base.js";
import { initUserCmds } from "./clicmds/cmds.js";
import type { McpClient } from "../main.js";
import type { Agent } from "@agent-smith/agent";
import { exit } from "node:process";
//import { usePerfTimer } from "../main.js";

const program = new Command();

async function chat(program: Command, options: InferenceOptions, agent: Agent, mcpServers: Array<McpClient>) {
    //console.log("CHAT OPTS", options);
    const data = { message: '>', default: "" };
    const prompt = await input(data);
    if (prompt == "/q") {
        isChatMode.value = false;
        if (runMode.value == "cmd") {
            process.exit(0)
        } else {
            mcpServers.forEach(async (s) => await s.stop());
            await query(program)
        }
    }
    //console.log("CHAT HIST", agent.history);
    //options.history = undefined;
    //console.log("RUN W PROMPT", prompt);
    await agent.run(prompt, chatInferenceParams, options, chatTemplate ? chatTemplate : undefined);
    console.log();
    await chat(program, options, agent, mcpServers);
}

async function buildCmds(): Promise<Command> {
    //program.allowUnknownOption(true);
    //const perf = usePerfTimer();
    initBaseCommands(program);
    //perf.measure("initBaseCommands");
    const aliases = readAliases();
    //perf.measure("readAliases");
    const feats = readFeatures();
    //perf.measure("readFeatures");
    initCommandsFromAliases(program, aliases, feats);
    //perf.measure("initCommandsFromAliases");
    await initUserCmds(feats.cmd, program);
    //perf.measure("initUserCmds");
    //perf.measure("cmds for each");
    //perf.final("buildCmds");
    return program
}

/*async function buildCmds(): Promise<Command> {
    // Performance measurement start
    const startTime = process.hrtime.bigint();
    const measurements: { name: string; time: number; percentage: number }[] = [];
    let lastTime = startTime;

    function measureFunction(name: string) {
        const currentTime = process.hrtime.bigint();
        const elapsedNs = Number(currentTime - lastTime);
        const elapsedSec = elapsedNs / 1_000_000_000;
        measurements.push({ name, time: elapsedSec, percentage: 0 });
        lastTime = currentTime;
    }

    //program.allowUnknownOption(true);
    measureFunction("start");
    initBaseCommands(program);

    measureFunction("initBaseCommands");
    const aliases = readAliases();

    measureFunction("readAliases");
    const feats = readFeatures();

    measureFunction("readFeatures");
    initCommandsFromAliases(program, aliases, feats);

    measureFunction("initCommandsFromAliases");
    const cmds = await initUserCmds(feats.cmd);

    measureFunction("initUserCmds");
    cmds.forEach(c => {
        //console.log("Add cmd", c.name());
        program.addCommand(c)
    });
    measureFunction("cmds.forEach");

    // Calculate percentages and display results
    const totalTime = Number(process.hrtime.bigint() - startTime) / 1_000_000_000;
    measurements.forEach(m => {
        m.percentage = (m.time / totalTime) * 100;
    });

    console.log("\nPerformance Measurements for buildCmds:");
    measurements.forEach(m => {
        console.log(`${m.name}: ${m.time.toFixed(6)}s (${m.percentage.toFixed(2)}%)`);
    });
    console.log(`Total time: ${totalTime.toFixed(6)}s\n`);

    return program
}*/

async function parseCmd(program: Command) {
    program.name('Agent Smith terminal client');
    program.description('Terminal agents toolkit');
    await program.parseAsync();
    exit(0)
    /*if (isChatMode.value) {
        await chat(program)
    }*/
}

export {
    buildCmds,
    chat,
    parseCmd, program
};

