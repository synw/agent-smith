import { db, readConf } from "@agent-smith/cli";
import type { ConfigFile } from "@agent-smith/types";

function getConfig(): { found: boolean, conf: ConfigFile, path: string } {
    const fp = db.readFilePaths();
    let confFilePath = "";
    //let promptFilePath = "";
    for (const p of fp) {
        if (p.name == "conf") {
            confFilePath = p.path;
            break
        }
    }
    if (confFilePath == "") {
        return { found: false, conf: {}, path: "" }
    }
    const c = readConf(confFilePath);
    return { found: c.found, conf: c.data, path: confFilePath }
}

export {
    getConfig,
}