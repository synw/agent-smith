import { input } from '@inquirer/prompts';
import { chat } from './cmd/cmds.js';
import { isChatMode } from './state/state.js';
import { Command } from 'commander/typings/index.js';

async function query(program: Command) {
    const data = { message: "$", default: "" };
    const q = await input(data);
    const args = q.split(" ")
    /*program.hook('preAction', (thisCommand, actionCommand) => {
        const options = actionCommand.opts();
        if (options?.chat === true) {
            isChatMode.value = true
        }
    });*/
    await program.parseAsync(args, { from: "user" });
    if (isChatMode.value) {
        await chat(program)
    }
    await query(program)
}

export { query }
