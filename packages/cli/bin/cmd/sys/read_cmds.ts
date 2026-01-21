import { Command } from "commander";
import { pathToFileURL } from 'url';
import { runtimeWarning } from "../lib/user_msgs.js";

async function readCmd(name: string, cmdPath: string): Promise<Command | null> {
    const url = pathToFileURL(cmdPath).href;
    let _cmd: Command | null = null;
    try {
        const mod = await import(url);
        _cmd = mod.cmd;
    }
    catch (e) {
        runtimeWarning(`command ${name} not found at ${cmdPath}, ${e}`);
        return null
    }
    if (!_cmd) { throw new Error("no cmd") }
    return _cmd
}

export { readCmd }