import path from "path";
import { readModelfiles } from "../../db/read.js";
import { readModelsFile } from "../sys/read_modelfile.js";
import { DbModelDef } from "../../interfaces.js";
import { upsertModels } from "../../db/write.js";

function updateModels() {
    const mfs = readModelfiles();
    //console.log("Update models", mfs);
    const modelNames = new Array<string>();
    const modelDefs = new Array<DbModelDef>();
    mfs.forEach((mf) => {
        const filePath = path.join(mf.path + "/" + mf.name + "." + mf.ext);
        //console.log("Read", filePath);
        const { models, ctx, max_tokens, found } = readModelsFile(filePath);
        //console.log("Models", models);
        if (!found) {
            throw new Error(`model file ${filePath} not found`)
        }
        for (const [name, m] of (Object.entries(models))) {
            if (modelNames.includes(m.name)) {
                console.log("🔴 [models] error: duplicate model name", m.name, "found in", filePath);
                continue
            }
            if (!m?.ctx) {
                m.ctx = ctx;
            }
            if (!m?.inferParams) {
                m.inferParams = {}
            }
            if (!m?.inferParams?.max_tokens) {
                m.inferParams.max_tokens = max_tokens;
            }
            const md: DbModelDef = { name: m.name, shortname: name, data: m };
            modelDefs.push(md)
        }
        //console.log("FMD", modelDefs);
        upsertModels(modelDefs)
    });
}

export {
    updateModels,
}