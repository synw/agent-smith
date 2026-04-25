import { default as fs } from "fs";
import { access, constants } from 'fs/promises';
import { resolve } from 'path';

function readFile(fp: string): string {
    try {
        return fs.readFileSync(fp, 'utf8');
    } catch (e) {
        throw new Error(`reading file ${e}}`)
    }
}

async function checkIfFileExists(filePath: string): Promise<boolean> {
    try {
        await access(resolve(filePath), constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export {
    readFile,
    checkIfFileExists,
}