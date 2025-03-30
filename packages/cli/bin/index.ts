#!/usr/bin/env node
import { argv } from 'process';
import { query } from "./cli.js";
import { initState, runMode } from './state/state.js';
import { initAgent } from './agent.js';
import { initCliCmds, parseCmd } from './cmd/cmds.js';

async function main() {
    if (argv.length == 2) {
        runMode.value = "cli";
    }
    //console.log("START")
    await initState();
    await initAgent();
    switch (runMode.value) {
        case "cli":
            await initCliCmds();
            await query()
            break;
        default:
            await parseCmd();
            break;
    }
}

(async () => {
    await main();
})();