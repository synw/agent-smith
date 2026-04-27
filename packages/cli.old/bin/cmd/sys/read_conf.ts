import { ConfigFile } from "../../interfaces.js";
import { default as fs } from "fs";
import YAML from 'yaml';

function readConf(confPath: string): { found: boolean, data: ConfigFile } {
    if (!fs.existsSync(confPath)) {
        return { data: {} as ConfigFile, found: false }
    }
    const file = fs.readFileSync(confPath, 'utf8');
    const data = YAML.parse(file);
    //console.log("READ CONF", data);
    return { data: data, found: true }
}

export { readConf }
