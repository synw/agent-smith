import { ConfigFile } from "../../interfaces.js";
import { default as fs } from "fs";
import YAML from 'yaml';

function readYmlAction(path: string): { found: boolean, data: Record<string, any> } {
    if (!fs.existsSync(path)) {
        return { data: {} as ConfigFile, found: false }
    }
    const file = fs.readFileSync(path, 'utf8');
    const data = YAML.parse(file);
    return { data: data, found: true }
}

export { readYmlAction }
