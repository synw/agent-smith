import * as fs from 'fs';

function deleteFileIfExists(filePath: string): void {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    } else {
        throw new Error(`File ${filePath} does not exist.`);
    }
}

export { deleteFileIfExists }