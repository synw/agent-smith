import { FeatureExtension, FeatureSpec, FeatureType } from "../interfaces.js";
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

function readFeaturesType(type: FeatureType): Record<string, string> {
    const stmt = db.prepare(`SELECT name, path FROM ${type}`);
    const data = stmt.all() as Array<Record<string, any>>;
    let f: Record<string, string> = {};
    data.forEach((row) => {
        f[row.name] = row.path
    });
    return f
}

function readFeatures(): Record<FeatureType, Record<string, string>> {
    const feats: Record<FeatureType, Record<string, string>> = { task: {}, job: {}, action: {}, cmd: {} };
    feats.task = readFeaturesType("task");
    feats.job = readFeaturesType("job");
    feats.action = readFeaturesType("action");
    feats.cmd = readFeaturesType("cmd");
    return feats
}

function readFeature(name: string, type: FeatureType): { found: boolean, feature: FeatureSpec } {
    const q = `SELECT id, path, ext FROM ${type} WHERE name='${name}'`;
    //console.log(q);
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


export { readFeatures, readFeaturePaths, readFeature, readPlugins }