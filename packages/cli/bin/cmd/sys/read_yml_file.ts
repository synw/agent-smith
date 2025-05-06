import { default as fs } from "fs";
import YAML from 'yaml';

function readYmlFile(path: string): { found: boolean, data: Record<string, any> } {
    if (!fs.existsSync(path)) {
        return { data: {}, found: false }
    }
    const file = fs.readFileSync(path, 'utf8');
    const data = YAML.parse(file);
    return { data: data, found: true }
}

export { readYmlFile }
