import { Command } from "commander";
import { pathToFileURL } from 'url';

async function readCmd(name: string, cmdPath: string): Promise<Command> {
    const cmds = new Array<Command>();
    const url = pathToFileURL(cmdPath).href;
    const { cmd } = await import(url);
    if (!cmd) {
        throw new Error(`command ${name} not found at ${cmdPath}`)
    }
    cmds.push(cmd)
    return cmd
}

export { readCmd }