import path from "path";
import { default as fs } from "fs";

// @ts-ignore
const confDir = path.join(process.env.HOME, ".config/agent-smith/cli");
const dbPath = path.join(confDir, "config.db");

function createConfDirIfNotExists(): boolean {
    //console.log(confDir, fs.existsSync(confDir));
    if (!fs.existsSync(confDir)) {
        fs.mkdirSync(confDir, { recursive: true });
        return false
    }
    return true
}

export {
    confDir,
    dbPath,
    createConfDirIfNotExists,
}