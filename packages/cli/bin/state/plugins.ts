import { readPluginNames } from "../db/read.js";

async function readPluginsPaths(names?: Array<string>): Promise<Array<string>> {
    const paths = new Array<string>();
    const packs = names ?? readPluginNames();
    //console.log("PLUGINS", packs);
    if (packs.length > 0) {
        packs.forEach((p) => {
            paths.push(p.trim())
        });
    };
    //console.log("PLUGINS PATHS", paths);
    return paths
}

export { readPluginsPaths }