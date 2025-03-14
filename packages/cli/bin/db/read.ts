import { AliasType, FeatureExtension, FeatureSpec, FeatureType } from "../interfaces.js";
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
    const feats: Record<FeatureType, Record<string, string>> = { task: {}, job: {}, action: {}, cmd: {}, workflow: {} };
    feats.task = _readFeaturesType("task");
    feats.job = _readFeaturesType("job");
    feats.action = _readFeaturesType("action");
    feats.cmd = _readFeaturesType("cmd");
    feats.workflow = _readFeaturesType("workflow");
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

function readPromptFile(): string {
    const stmt1 = db.prepare("SELECT * FROM filepath WHERE name = ?");
    const result = stmt1.get("promptfile") as Record<string, any>;
    let res = "";
    if (result?.id) {
        res = result.path
    }
    return res
}

export { readFeatures, readFeaturePaths, readFeature, readPlugins, readAliases, readPromptFile }