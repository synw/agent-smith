import * as fs from 'fs';
import * as path from 'path';

function createDirectoryIfNotExists(dirPath: string, recursive = false): void {
    const resolvedDirPath = path.resolve(dirPath);
    if (!fs.existsSync(resolvedDirPath)) {
        fs.mkdirSync(resolvedDirPath, { recursive: recursive });
    }
}

export { createDirectoryIfNotExists }