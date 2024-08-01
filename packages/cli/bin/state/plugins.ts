import { execute } from "../main.js";
import { readPluginNames } from "../db/read.js";
import path from "path";

async function readPluginsPaths(names?: Array<string>): Promise<Array<string>> {
    const paths = new Array<string>();
    const packs = names ?? readPluginNames();
    const root = await execute("npm", ["root", "-g"]);
    const rootPath = root.trim();
    //console.log("PLUGINS", packs);
    if (packs.length > 0) {
        packs.forEach((p) => {
            paths.push(path.join(rootPath, p, "dist"))
        });
    };
    //console.log("PLUGINS PATHS", paths);
    return paths
}

export { readPluginsPaths }