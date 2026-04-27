import { execute } from "../main.js";
import { readPlugins } from "../db/read.js";
import path from "path";

async function buildPluginsPaths(names: Array<string>): Promise<Array<{ name: string, path: string }>> {
    const plugins = new Array<{ name: string, path: string }>();
    const root = await execute("npm", ["root", "-g"]);
    const rootPath = root.trim();
    //console.log("PLUGINS", packs);
    names.forEach((p) => {
        plugins.push({
            name: p,
            path: path.join(rootPath, p, "dist")
        })
    });
    //console.log("PLUGINS PATHS", paths);
    return plugins
}

async function readPluginsPaths(): Promise<Array<string>> {
    const paths = new Array<string>();
    const plugins = readPlugins();
    plugins.forEach((p) => {
        paths.push(p.path)
    });
    //console.log("PLUGINS PATHS", paths);
    return paths
}

export { buildPluginsPaths, readPluginsPaths }