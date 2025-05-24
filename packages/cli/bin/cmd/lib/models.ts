import path from "path";
import { readModelfiles, readModels } from "../../db/read.js";
import { readModelsFile } from "../sys/read_modelfile.js";
import { DbModelDef } from "../../interfaces.js";
import { updateModels as dbUpdateModels } from "../../db/write.js";
import color from "ansi-colors";

async function showModelsCmd(args: Array<string>) {
    //console.log("SMC", args);
    let models = readModels();
    models.sort((a, b) => a.name.localeCompare(b.name));
    let foundModels = new Array<DbModelDef>();
    if (args.length > 0) {
        args.forEach((a) => {
            const fm = models.filter((m) => m.shortname.includes(a) || m.name.includes(a));
            //console.log(a, "=>", fm.map(m => m.shortname))
            foundModels.push(...fm)
        });
    } else {
        foundModels = models;
    }
    foundModels.forEach((model) => {
        const ips = model.data.inferParams;
        /*if (!ips?.max_tokens) {
            throw new Error(`no max tokens in ${model.shortname}`)
        }*/
        const mt = ips.max_tokens;
        delete ips.max_tokens;
        const vip = Object.keys(ips).length > 0 ? JSON.stringify(ips) : "";
        const m = `- ${color.yellow(model.shortname)}: ${color.bold(model.data.name)} - ${model.data.ctx} ctx / ${mt} max tokens ${vip}`;
        console.log(m)
    })
}

function updateAllModels() {
    const mfs = readModelfiles();
    //console.log("Update models", mfs);
    //const modelNames = new Array<string>();
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
            /*if (modelNames.includes(m.name)) {
                console.log("🔴 [models] error: duplicate model name", m.name, "found in", filePath);
                continue
            }*/
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
    });
    //console.log("******************** FMD", modelDefs.length);
    dbUpdateModels(modelDefs)
}

export {
    updateAllModels,
    showModelsCmd,
}