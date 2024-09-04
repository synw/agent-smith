import { AliasType, FeatureSpec, FeatureType, Features } from "../interfaces.js";
import { db } from "./db.js";

const defaultFilepaths = {
    prompt: "",
    override: "",
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
    updateAliases,
}
