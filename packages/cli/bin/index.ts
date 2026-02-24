#!/usr/bin/env node
import { argv, exit } from 'process';
import { query } from "./cli.js";
import { resetDbCmd } from './cmd/clicmds/cmds.js';
import { updateConfCmd } from './cmd/clicmds/updateconf.js';
import { buildCmds, parseCmd } from './cmd/cmds.js';
import { formatMode, init, inputMode, isChatMode, outputMode, runMode } from './state/state.js';
//import { usePerfTimer } from './main.js';

async function main() {
    //const perf = usePerfTimer();
    const nargs = argv.length;
    if (nargs == 2) {
        runMode.value = "cli";
    }
    else if (nargs >= 3) {
        if (argv[2] == "conf") {
            await updateConfCmd(argv.slice(-1));
            return
        } else if (argv[2] == "reset") {
            await resetDbCmd()
            return
        }
    }
    //perf.measure("base");
    await init();
    //perf.measure("init");
    const program = await buildCmds();
    //perf.measure("buildCmds");
    //perf.final("index start");
    program.hook('preAction', async (thisCommand, actionCommand) => {
        const options = actionCommand.opts();
        //console.log("POPTS", options)
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
            //console.log("PARSE CMD END")
            break;
    }
    //console.log("END");
}

(async () => {
    await main();
})();