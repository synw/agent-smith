import { default as fs } from "fs";
import { default as path } from "path";
import { Command } from "commander";
import { pathToFileURL } from 'url';

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

async function readCmds(dir: string): Promise<Array<Command>> {
    const cmds = new Array<Command>();
    const fileNames = _readCmdsDir(dir);
    for (const name of fileNames) {
        const url = pathToFileURL(path.join(dir, name + ".js")).href;
        const { cmd } = await import(url);
        if (!cmd) {
            throw new Error(`command ${name} not found in ${dir}`)
        }
        cmds.push(cmd)
    }
    return cmds
}

export { readCmds }