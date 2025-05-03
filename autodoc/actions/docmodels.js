import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, readDir } from '../../packages/features/system/fs/dist/main.js';
import { executeTaskCmd } from '../../packages/cli/dist/main.js';

async function action(_args) {
    const __filename = fileURLToPath(import.meta.url);
    const baseDir = path.dirname(__filename);
    const ymlFilesPath = path.join(baseDir, "../../packages/features/models/dist/models");
    const modelFilePath = path.join(baseDir, "../../docsite/public/doc/terminal_client/plugins/2.models.md");
    const ymlFiles = await readDir([ymlFilesPath, "ext=.yml"]);
    const modelsDocfile = await readFile([modelFilePath]);
    const params = {
        name: "updatemodelsdoc",
        prompt: ymlFiles.prompt + "\n\n" + modelsDocfile.prompt,
        //modeldoc: modelsDocfile.prompt
    };
    //console.log("ENDR", params);
    const res = await executeTaskCmd(params);
    //console.log("RES", res);
    return { ok: true }
}

export {
    action,
}