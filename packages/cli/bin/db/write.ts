import { AliasType, FeatureSpec, FeatureType, Features } from "../interfaces.js";
import { db } from "./db.js";

function updatePromptfilePath(pf: string) {
    const deleteStmt = db.prepare("DELETE FROM featurespath WHERE path = ?");
    deleteStmt.run("promptfile");
    const stmt = db.prepare("INSERT INTO filepath (name, path) VALUES (?, ?)");
    stmt.run("promptfile", pf);
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

function insertPluginIfNotExists(n: string, p: string): boolean {
    const stmt1 = db.prepare("SELECT * FROM plugin WHERE name = ?");
    const result = stmt1.get(n) as Record<string, any>;
    if (result?.id) {
        return true;
    }
    const stmt = db.prepare("INSERT INTO plugin (name, path) VALUES (?,?)");
    stmt.run(n, p);
    return false
}

function cleanupFeaturePaths(paths: Array<string>): Array<string> {
    const stmt = db.prepare("SELECT path FROM featurespath");
    const rows = stmt.all() as Array<Record<string, any>>;
    const deleted = new Array<string>();
    for (const entry of rows) {
        if (!paths.includes(entry.path)) {
            const deleteStmt = db.prepare("DELETE FROM featurespath WHERE path = ?");
            deleteStmt.run(entry.path);
            deleted.push(entry.path)
        }
    }
    return deleted
}

function _updateAlias(existingAliases: Array<string>, name: string, type: AliasType) {
    if (!existingAliases.includes(name)) {
        const insertStmt = db.prepare("INSERT INTO aliases (name, type) VALUES (?, ?)");
        insertStmt.run(name, type);
    } else {
        console.log("Can not create command alias", name, ": duplicate name")
    }
    existingAliases.push(name);
    return existingAliases
}

function updateAliases(feats: Features) {
    const deleteStmt = db.prepare("DELETE FROM aliases");
    deleteStmt.run();
    let existingAliases = new Array<string>();
    feats.task.forEach((feat) => {
        existingAliases = _updateAlias(existingAliases, feat.name, "task")
    });
    feats.action.forEach((feat) => {
        existingAliases = _updateAlias(existingAliases, feat.name, "action")
    });
    feats.job.forEach((feat) => {
        existingAliases = _updateAlias(existingAliases, feat.name, "job")
    });
}

function upsertAndCleanFeatures(feats: Array<FeatureSpec>, type: FeatureType) {
    //console.log("Upsert", type);
    const stmt = db.prepare(`SELECT name FROM ${type}`);
    const rows = stmt.all() as Array<Record<string, any>>;
    const names = rows.map(row => row.name);
    // cleanup removed features
    const availableFeatsNames = feats.map((f) => f.name);
    //console.log("NAMES", names);
    //console.log("AVAILABLE", availableFeatsNames);
    names.forEach((name) => {
        //console.log(name, !availableFeatsNames.includes(name));
        if (!availableFeatsNames.includes(name)) {
            //console.log("DELETE", name);
            const deleteStmt = db.prepare(`DELETE FROM ${type} WHERE name = ?`);
            deleteStmt.run(name);
            console.log("-", "[" + type + "]", name);
        }
    });
    feats.forEach((feat) => {
        if (!names.includes(feat.name)) {
            //console.log("ADD", feat.name);
            const insertStmt = db.prepare(`INSERT INTO ${type} (name, path, ext) VALUES (?, ?, ?)`);
            insertStmt.run(feat.name, feat.path, feat.ext);
            console.log("+", "[" + type + "]", feat.name, feat.path);
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
    updatePromptfilePath,
    insertFeaturesPathIfNotExists,
    insertPluginIfNotExists,
    updateFeatures,
    updateAliases,
    cleanupFeaturePaths,
}
