#!/usr/bin/env node
import { argv } from 'process';
import { initAgent } from './agent.js';
import { query } from "./cli.js";
import { buildCmds, parseCmd } from './cmd/cmds.js';
import { formatMode, initState, inputMode, isChatMode, outputMode, runMode } from './state/state.js';
import { updateConfCmd } from './cmd/clicmds/update.js';

async function main() {
    const nargs = argv.length;
    if (nargs == 2) {
        runMode.value = "cli";
    }
    else if (nargs >= 3) {
        if (argv[2] == "conf") {
            await updateConfCmd(argv.slice(-1));
            return
        }
    }
    await initState();
    await initAgent();
    //console.log("START")
    const program = await buildCmds();
    program.hook('preAction', async (thisCommand, actionCommand) => {
        const options = actionCommand.opts();
        //const v = options?.clipboardOutput !== undefined;
        if (options?.chat === true) {
            isChatMode.value = true
        }
        if (options?.clipboardInput !== undefined) {
            inputMode.value = "clipboard"
        }
        if (options?.inputFile !== undefined) {
            inputMode.value = "promptfile"
        }
        if (options?.markdownOutput !== undefined) {
            formatMode.value = "markdown"
        }
        if (options?.clipboardOutput !== undefined) {
            outputMode.value = "clipboard"
        }
    });
    switch (runMode.value) {
        case "cli":
            await query(program)
            break;
        default:
            await parseCmd(program);
            break;
    }
}

(async () => {
    await main();
})();