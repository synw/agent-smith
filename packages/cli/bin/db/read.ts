import { ToolSpec } from "modprompt";
import { AliasType, FeatureExtension, FeatureSpec, FeatureType, DbModelDef, ToolType, ModelSpec } from "../interfaces.js";
import { db } from "./db.js";

function readFeaturePaths(): Array<string> {
    const stmt = db.prepare("SELECT path FROM featurespath");
    const data = stmt.all() as Array<Record<string, any>>;
    let f = new Array<string>();
    data.forEach((row) => {
        f.push(row.path)
    });
    return f
}

function readPlugins(): Array<Record<string, string>> {
    const stmt = db.prepare("SELECT name, path FROM plugin");
    const data = stmt.all() as Array<Record<string, any>>;
    let f = new Array<Record<string, string>>();
    data.forEach((row) => {
        f.push({ name: row.name, path: row.path })
    });
    return f
}

function _readFeaturesType(type: FeatureType): Record<string, string> {
    const stmt = db.prepare(`SELECT name, path FROM ${type}`);
    const data = stmt.all() as Array<Record<string, any>>;
    let f: Record<string, string> = {};
    data.forEach((row) => {
        f[row.name] = row.path
    });
    return f
}

function readFeatures(): Record<FeatureType, Record<string, string>> {
    const feats: Record<FeatureType, Record<string, string>> = {
        task: {}, action: {}, cmd: {}, workflow: {}, adaptater: {}, modelfile: {}
    };
    feats.task = _readFeaturesType("task");
    feats.action = _readFeaturesType("action");
    feats.cmd = _readFeaturesType("cmd");
    feats.workflow = _readFeaturesType("workflow");
    feats.adaptater = _readFeaturesType("adaptater");
    feats.modelfile = _readFeaturesType("modelfile");
    return feats
}

function readAliases(): Array<{ name: string, type: AliasType }> {
    const stmt = db.prepare("SELECT name, type FROM aliases");
    const data = stmt.all() as Array<Record<string, any>>;
    let f = new Array<{ name: string, type: AliasType }>();
    data.forEach((row) => {
        f.push({ name: row.name, type: row.type as AliasType })
    });
    return f
}

function readFeature(name: string, type: FeatureType): { found: boolean, feature: FeatureSpec } {
    const q = `SELECT id, name, path, ext FROM ${type} WHERE name='${name}'`;
    const stmt = db.prepare(q);
    const result = stmt.get() as Record<string, string>;
    if (result?.id) {
        return {
            found: true,
            feature: {
                name: result.name,
                path: result.path,
                ext: result.ext as FeatureExtension,
            }
        }
    }
    return { found: false, feature: {} as FeatureSpec }
}

function readTool(name: string): { found: boolean, tool: ToolSpec, type: ToolType } {
    const q = `SELECT id, name, type, spec FROM tool WHERE name='${name}'`;
    const stmt = db.prepare(q);
    const result = stmt.get() as Record<string, string>;
    if (result?.id) {
        const tool = JSON.parse(result.spec);
        return {
            found: true,
            tool: tool as ToolSpec,
            type: result.type as ToolType,
        }
    }
    return { found: false, tool: {} as ToolSpec, type: "action" }
}

function readFilePaths(): Array<{ name: string, path: string }> {
    const stmt1 = db.prepare("SELECT name, path FROM filepath");
    const data = stmt1.all() as Array<{ name: string, path: string }>;
    let f = new Array<{ name: string, path: string }>();
    data.forEach((row) => {
        f.push({ name: row.name, path: row.path })
    });
    return f
}

function readFilePath(name: string): { found: boolean, path: string } {
    const q = `SELECT id, path FROM filepath WHERE name= ?`;
    const stmt = db.prepare(q);
    const result = stmt.get(name) as Record<string, string>;
    if (result?.id) {
        return { found: true, path: result.path }
    }
    return { found: false, path: "" }
}

function readModelfiles(): Array<Record<string, string>> {
    const stmt = db.prepare("SELECT name, path, ext FROM modelfile");
    const data = stmt.all() as Array<Record<string, string>>;
    let f = new Array<Record<string, string>>();
    data.forEach((row) => {
        f.push(row)
    });
    return f
}

function readModels(): Array<DbModelDef> {
    const stmt = db.prepare("SELECT name, shortname, data FROM model");
    const data = stmt.all() as Array<Record<string, any>>;
    let f = new Array<DbModelDef>();
    data.forEach((row) => {
        const ips = JSON.parse(row.data);
        const mod: DbModelDef = {
            name: row.name,
            shortname: row.shortname,
            data: ips,
        }
        f.push(mod)
    });
    return f
}

function readModel(shortname: string): { found: boolean, modelData: Record<string, any> } {
    const q = `SELECT id, data FROM model WHERE shortname='${shortname}'`;
    const stmt = db.prepare(q);
    const result = stmt.get() as Record<string, string>;
    if (result?.id) {
        const data = JSON.parse(result.data);
        return { found: true, modelData: data }
    }
    return { found: false, modelData: {} }
}

export {
    readFeatures,
    readFeaturePaths,
    readFeature,
    readPlugins,
    readAliases,
    readFilePath,
    readFilePaths,
    readTool,
    readModels,
    readModelfiles,
    readModel,
}