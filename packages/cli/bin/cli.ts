import { input } from '@inquirer/prompts';
import { chat } from './cmd/cmds.js';
import { isChatMode } from './state/state.js';
import { Command } from 'commander/typings/index.js';

async function query(program: Command) {
    const data = { message: "$", default: "" };
    const q = await input(data);
    const args = q.split(" ")
    await program.parseAsync(args, { from: "user" });
    if (isChatMode.value) {
        await chat(program)
    }
    await query(program)
}

export { query }
