import { default as fs } from "fs";
import { default as path } from "path";
import { Cmd } from "../../interfaces.js";

function _readCmdsDir(dir: string): Array<string> {
    const fileNames = new Array<string>;
    fs.readdirSync(dir).forEach((filename) => {
        const filepath = path.join(dir, filename);
        const isDir = fs.statSync(filepath).isDirectory();
        if (!isDir) {
            if (filename.endsWith(".ts") || filename.endsWith(".js")) {
                const name = filename.replace(".js", "").replace(".ts", "");
                fileNames.push(name)
            }
        }
    });
    return fileNames
}

async function readCmds(dir: string): Promise<Record<string, Cmd>> {
    const cmds: Record<string, Cmd> = {};
    const fileNames = _readCmdsDir(dir);
    for (const name of fileNames) {
        const { cmd } = await import(path.join(dir, name + ".js"));
        if (!cmd) {
            throw new Error(`command ${name} not found in ${dir}`)
        }
        cmds[name] = cmd
    }
    return cmds
}

export { readCmds }