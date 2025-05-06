import { extractToolDoc } from "../cmd/lib/tools.js";
import { AliasType, FeatureSpec, FeatureType, Features, DbModelDef } from "../interfaces.js";
import { db } from "./db.js";

function updatePromptfilePath(pf: string) {
    const deleteStmt = db.prepare("DELETE FROM filepath WHERE name = ?");
    deleteStmt.run("promptfile");
    const stmt = db.prepare("INSERT INTO filepath (name, path) VALUES (?, ?)");
    stmt.run("promptfile", pf);
}

function updateDataDirPath(dd: string) {
    const deleteStmt = db.prepare("DELETE FROM filepath WHERE name = ?");
    deleteStmt.run("datadir");
    const stmt = db.prepare("INSERT INTO filepath (name, path) VALUES (?, ?)");
    stmt.run("datadir", dd);
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
    feats.workflow.forEach((feat) => {
        existingAliases = _updateAlias(existingAliases, feat.name, "workflow")
    });
}

function upsertAndCleanFeatures(feats: Array<FeatureSpec>, type: FeatureType): Array<FeatureSpec> {
    const stmt = db.prepare(`SELECT name FROM ${type}`);
    const rows = stmt.all() as Array<Record<string, any>>;
    const names = rows.map(row => row.name);
    // cleanup removed features
    const availableFeatsNames = feats.map((f) => f.name);
    //console.log("NAMES", names);
    //console.log("AVAILABLE", availableFeatsNames);
    const newFeatures = new Array<FeatureSpec>();
    names.forEach((name) => {
        //console.log(name, !availableFeatsNames.includes(name));
        if (!availableFeatsNames.includes(name)) {
            //console.log("DELETE", name);
            const deleteStmt = db.prepare(`DELETE FROM ${type} WHERE name = ?`);
            deleteStmt.run(name);
            console.log("-", "[" + type + "]", name);
            // check if the feature has a tool and delete if if so
            const stmt1 = db.prepare("SELECT * FROM tool WHERE name = ?");
            const result = stmt1.get(name) as Record<string, any>;
            if (result?.id) {
                const deleteStmt = db.prepare("DELETE FROM featurespath WHERE id = ?");
                deleteStmt.run(result.id);
                console.log("-", "[tool] from", type, ":", name);
            }
        }
    });
    feats.forEach((feat) => {
        if (!names.includes(feat.name)) {
            //console.log("ADD", type, feat);
            const insertStmt = db.prepare(`INSERT INTO ${type} (name, path, ext) VALUES (?, ?, ?)`);
            insertStmt.run(feat.name, feat.path, feat.ext);
            console.log("+", "[" + type + "]", feat.name, feat.path);
            newFeatures.push(feat)
        }
    });
    return newFeatures
}

function upsertTool(name: string, type: FeatureType, toolDoc: string) {
    const stmt1 = db.prepare("SELECT * FROM tool WHERE name = ?");
    const result = stmt1.get(name) as Record<string, any>;
    if (result?.id) {
        return;
    }
    const stmt = db.prepare("INSERT INTO tool (name, spec, type) VALUES (?,?,?)");
    stmt.run(name, toolDoc, type);
    console.log("+", "[tool] from", type, ":", name);
}

function upsertModels(models: Array<DbModelDef>) {
    const stmt1 = db.prepare("SELECT shortname FROM model");
    const rows = stmt1.all() as Array<Record<string, any>>;
    const existingModelShortNames = rows.map(row => row.shortname) as Array<string>;
    const stmt = db.prepare(`INSERT INTO model (name, shortname, data) VALUES (?,?,?)`);
    existingModelShortNames.forEach((name) => {
        //console.log(name, !availableFeatsNames.includes(name));
        if (!existingModelShortNames.includes(name)) {
            //console.log("DELETE", name);
            const deleteStmt = db.prepare("DELETE FROM model WHERE name = ?");
            deleteStmt.run(name);
            console.log("-", "[model]", name);
        }
    });
    db.transaction(() => {
        for (const model of models) {
            const stmt1 = db.prepare("SELECT * FROM model WHERE shortname = ?");
            const result = stmt1.get(model.shortname) as Record<string, any>;
            if (result?.id) {
                continue
            }
            stmt.run(model.name, model.shortname, JSON.stringify(model.data));
        }
    })();
}

function updateFeatures(feats: Features) {
    //console.log("FEATS", feats);
    const newTasks = upsertAndCleanFeatures(feats.task, "task");
    newTasks.forEach((feat) => {
        const { found, toolDoc } = extractToolDoc(feat.name, feat.ext, feat.path);
        //console.log(`TASK ${feat.name} TOOL DOC`, toolDoc);
        if (found) {
            upsertTool(feat.name, "task", toolDoc)
        }
    });
    const newActions = upsertAndCleanFeatures(feats.action, "action");
    newActions.forEach((feat) => {
        const { found, toolDoc } = extractToolDoc(feat.name, feat.ext, feat.path);
        //console.log(`ACTION ${feat.name} TOOL DOC`, toolDoc);
        if (found) {
            upsertTool(feat.name, "action", toolDoc)
        }
    });
    const newWorkflows = upsertAndCleanFeatures(feats.workflow, "workflow");
    newWorkflows.forEach((feat) => {
        const { found, toolDoc } = extractToolDoc(feat.name, feat.ext, feat.path);
        //console.log(`WORKFLOW ${feat.name} TOOL DOC`, toolDoc);
        if (found) {
            upsertTool(feat.name, "workflow", toolDoc)
        }
    });
    upsertAndCleanFeatures(feats.adaptater, "adaptater");
    upsertAndCleanFeatures(feats.cmd, "cmd");
    upsertAndCleanFeatures(feats.modelfile, "modelfile");
}

export {
    updatePromptfilePath,
    updateDataDirPath,
    insertFeaturesPathIfNotExists,
    insertPluginIfNotExists,
    updateFeatures,
    updateAliases,
    cleanupFeaturePaths,
    upsertModels,
}
