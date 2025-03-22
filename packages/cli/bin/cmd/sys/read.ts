import { default as fs } from "fs";

function readFile(fp: string): string {
    try {
        return fs.readFileSync(fp, 'utf8');
    } catch (e) {
        throw new Error(`reading file ${e}}`)
    }
}

export {
    readFile,
}