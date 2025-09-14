import path from "path";
import { readConf } from "./cmd/sys/read_conf.js";
import { upsertBackends, insertFeaturesPathIfNotExists, insertPluginIfNotExists } from "./db/write.js";
import { buildPluginsPaths } from "./state/plugins.js";
import { runtimeError } from "./cmd/lib/user_msgs.js";
import { ConfInferenceBackend, InferenceBackend } from "./interfaces.js";
import { localBackends } from "./const.js";

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
    const backends: Record<string, InferenceBackend> = {};
    let defaultBackendName = "";
    if (data?.backends) {
        for (const [name, val] of Object.entries(data.backends)) {
            switch (name) {
                case "local":
                    const bs = val as Array<string>;
                    bs.forEach(b => {
                        if (!["llamacpp", "koboldcpp", "ollama"].includes(b)) {
                            throw new Error(`Unknow backend default value: ${b}`);
                        }
                        const lb = localBackends[b];
                        backends[lb.name] = lb;
                    })
                    break;
                case "default":
                    const v1 = val as string;
                    defaultBackendName = v1;
                    break;
                default:
                    const v3 = val as ConfInferenceBackend;
                    let apiKey: string | undefined = undefined;
                    if (v3?.apiKey) {
                        apiKey = v3.apiKey;
                    }
                    const ib: InferenceBackend = {
                        name: name,
                        type: v3.type,
                        url: v3.url,
                        isDefault: false,
                    };
                    if (apiKey) {
                        ib.apiKey = apiKey
                    }
                    backends[name] = ib;
                    break;
            }
        }
    }
    console.log("Default backend:", defaultBackendName);
    console.dir(backends, { depth: 4 });
    if (!Object.keys(backends).includes(defaultBackendName)) {
        throw new Error(`Undeclared default backend: ${defaultBackendName}`)
    }
    backends[defaultBackendName].isDefault = true;
    upsertBackends(Object.values(backends));
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