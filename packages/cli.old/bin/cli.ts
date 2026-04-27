import { input } from '@inquirer/prompts';
import { chat } from './cmd/cmds.js';
import { isChatMode } from './state/state.js';
import { Command } from 'commander/typings/index.js';
import { Agent } from '@agent-smith/agent';
import { backend } from './state/backends.js';

async function query(program: Command) {
    const data = { message: "$", default: "" };
    const q = await input(data);
    //console.log("QUERY", q);
    const args = q.split(" ")
    await program.parseAsync(args, { from: "user" });
    if (isChatMode.value) {
        const agent = new Agent(backend.value!, "chat")
        await chat(program, {}, agent, [])
    }
    await query(program)
}

export { query }
