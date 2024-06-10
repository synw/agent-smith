import { FeatureSpec, FeatureType, Features } from "../interfaces.js";
import { db } from "./db.js";

const defaultFilepaths = {
    prompt: "",
}

function insertDefaultFilepaths() {
    for (const [k, v] of Object.entries(defaultFilepaths)) {
        const stmt = db.prepare("INSERT INTO filepath (name, path) VALUES (?, ?)");
        stmt.run(k, v);
    }
}

function insertFeaturesPathIfNotExists(path: string): boolean {
    const stmt1 = db.prepare("SELECT * FROM featurespath WHERE path = ?");
    const result = stmt1.get(path) as Record<string, any>;
    if (result?.id) {
        return true;
    }
    const stmt = db.prepare("INSERT INTO featurespath (path) VALUES (?)");
    stmt.run(path);
    return false
}

function insertPluginIfNotExists(n: string): boolean {
    const stmt1 = db.prepare("SELECT * FROM plugin WHERE name = ?");
    const result = stmt1.get(n) as Record<string, any>;
    if (result?.id) {
        return true;
    }
    const stmt = db.prepare("INSERT INTO plugin (name) VALUES (?)");
    stmt.run(n);
    return false
}

function upsertAndCleanFeatures(feats: Array<FeatureSpec>, type: FeatureType) {
    const stmt = db.prepare(`SELECT name FROM ${type}`);
    const rows = stmt.all() as Array<Record<string, any>>;
    const names = rows.map(row => row.name);
    feats.forEach((feat) => {
        if (!names.includes(feat.name)) {
            const insertStmt = db.prepare(`INSERT INTO ${type} (name, path, ext) VALUES (?, ?, ?)`);
            insertStmt.run(feat.name, feat.path, feat.ext);
        }
    });
    // cleanup removed features
    const availableFeatsNames = feats.map((f) => f.name);
    //console.log("AF", availableFeatsNames, names);
    names.forEach((name) => {
        //console.log(name, !availableFeatsNames.includes(name));
        if (!availableFeatsNames.includes(name)) {
            const deleteStmt = db.prepare(`DELETE FROM ${type} WHERE name = ?`);
            deleteStmt.run(name);
        }
    });

}

function updateFeatures(feats: Features) {
    upsertAndCleanFeatures(feats.task, "task");
    upsertAndCleanFeatures(feats.job, "job");
    upsertAndCleanFeatures(feats.action, "action");
    upsertAndCleanFeatures(feats.cmd, "cmd");
}

export {
    insertDefaultFilepaths,
    insertFeaturesPathIfNotExists,
    insertPluginIfNotExists,
    updateFeatures,
}
