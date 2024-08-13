#!/usr/bin/env node
import { argv } from 'process';
import { query } from "./cli.js";
import { initState, runMode } from './state/state.js';
import { initAgent } from './agent.js';
import { initCmds, parseCmd } from './cmd/cmds.js';

async function main() {
    if (argv.length == 2) {
        runMode.value = "cli";
    }
    await initState();
    await initCmds();
    //await initAgent(runMode.value);
    switch (runMode.value) {
        case "cli":
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