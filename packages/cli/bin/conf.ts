import path from "path";
//import { default as fs } from "fs";
import { readConf } from "./cmd/sys/read_conf.js";
import { upsertBackend, insertFeaturesPathIfNotExists, insertPluginIfNotExists } from "./db/write.js";
import { buildPluginsPaths } from "./state/plugins.js";
import { runtimeError } from "./cmd/lib/user_msgs.js";

// @ts-ignore
const confDir = path.join(process.env.HOME, ".config/agent-smith/cli");
const dbPath = path.join(confDir, "config.db");

/*function createConfDirIfNotExists(): boolean {
    //console.log(confDir, fs.existsSync(confDir));
    if (!fs.existsSync(confDir)) {
        fs.mkdirSync(confDir, { recursive: true });
        return false
    }
    return true
}*/

async function processConfPath(confPath: string): Promise<{ paths: Array<string>, pf: string, dd: string }> {
    const { found, data } = readConf(confPath);
    if (!found) {
        runtimeError(`Config file ${confPath} not found`);
    }
    console.log(data)
    const allPaths = new Array<string>();
    // backends
    if (data?.backends) {
        for (const [name, bconf] of Object.entries(data.backends)) {
            const bc = {
                name: name,
                type: bconf.type,
                uri: bconf.uri,
                apiKey: bconf?.apiKey,
            };
            upsertBackend(bc);
        }
    }
    // features and plugins from conf
    if (data?.features) {
        allPaths.push(...data.features);
        const fts = new Array<string>();
        data.features.forEach((f) => {
            if (!fts.includes(f)) {
                insertFeaturesPathIfNotExists(f);
                fts.push(f)
            }
        });
    }
    if (data?.plugins) {
        const plugins = await buildPluginsPaths(data.plugins);
        plugins.forEach((_pl) => {
            allPaths.push(_pl.path);
            insertPluginIfNotExists(_pl.name, _pl.path);
        });
    }
    let pf = "";
    if (data?.promptfile) {
        pf = data.promptfile
    }
    let dd = "";
    if (data?.datadir) {
        dd = data.datadir
    }
    return { paths: allPaths, pf: pf, dd: dd }
}

export {
    confDir,
    dbPath,
    processConfPath,
}