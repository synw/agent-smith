#!/usr/bin/env node
import { argv } from 'process';
import { initAgent } from './agent.js';
import { query } from "./cli.js";
import { buildCmds, parseCmd } from './cmd/cmds.js';
import { initState, runMode } from './state/state.js';

async function main() {
    const nargs = argv.length;
    if (nargs == 2) {
        runMode.value = "cli";
    }
    /*else if (nargs >= 3) {
        if (argv[2] == "conf") {
            await updateConfCmd(argv.slice(-1), {});
            return
        }
    }*/
    //console.log("START")
    await initState();
    await initAgent();
    switch (runMode.value) {
        case "cli":
            const program = await buildCmds();
            await query(program)
            break;
        default:
            await parseCmd();
            break;
    }
}

(async () => {
    await main();
})();