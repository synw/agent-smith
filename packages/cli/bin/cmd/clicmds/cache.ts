import fs from 'fs';
import path from 'path';
import { FeatureSpec } from '../../interfaces.js';
import { runtimeError } from '../../utils/user_msgs.js';

function createCacheFileContent(cmdFeats: Array<FeatureSpec>): string {
    const imports = new Array<string>();
    const cmdNames = new Array<string>();
    let i = 1;
    cmdFeats.forEach(feat => {
        const fileName = feat.name + "." + feat.ext;
        const importPath = path.join(feat.path, fileName);
        const cmdId = `c${i}`;
        const line = `import { cmd as ${cmdId} } from "file://${importPath}";`
        imports.push(line);
        cmdNames.push(cmdId);
        ++i
    });
    const finalImports = imports.join("\n");
    const cmds = `const cmds = [ ${cmdNames.join(", ")} ]`;
    const end = "export { cmds }"
    return `${finalImports}\n\n${cmds}\n\n${end}`;
}

function ensureUserCmdsCacheFileExists(cacheFilePath: string): string {
    const fileExists = fs.existsSync(cacheFilePath);
    if (!fileExists) {
        fs.writeFileSync(cacheFilePath, "const cmds = [];\nexport { cmds }");
    }
    return cacheFilePath
}

function updateUserCmdsCache(cacheFilePath: string, cmdFeats: Array<FeatureSpec>) {
    //console.log("Update urs cmds cache at", cacheFilePath, ":", cmdFeats.length, "cmds");
    const filePath = ensureUserCmdsCacheFileExists(cacheFilePath);
    const cacheFileContent = createCacheFileContent(cmdFeats);
    //console.log(cacheFileContent);
    try {
        fs.writeFileSync(filePath, cacheFileContent);
    } catch (err) {
        runtimeError("Error writing to user commands cache file at " + filePath, `${err}`);
    }
}

export {
    ensureUserCmdsCacheFileExists,
    updateUserCmdsCache,
}