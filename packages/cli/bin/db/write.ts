import { extractTaskToolDocAndVariables, extractToolDoc } from "../cmd/lib/tools.js";
import { AliasType, FeatureSpec, FeatureType, Features, DbModelDef, InferenceBackend } from "../interfaces.js";
import { db } from "./db.js";
import { readModels } from "./read.js";

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

function setDefaultBackend(name: string) {
    const updateStmt = db.prepare("UPDATE backend SET isdefault = 0 WHERE isdefault = 1");
    updateStmt.run();
    const nupdStmt = db.prepare("UPDATE backend SET isdefault = 1 WHERE name = ?")
    nupdStmt.run(name)
}

function upsertBackends(bdata: Array<InferenceBackend>): boolean {
    let hasUpdates = false;

    // Get all existing backend names
    const existingStmt = db.prepare("SELECT name FROM backend");
    const existingBackends = existingStmt.all() as Array<{ name: string }>;
    const existingNames = new Set(existingBackends.map(b => b.name));

    // Create a set of new backend names for comparison
    const newNames = new Set(bdata.map(b => b.name));

    // Delete backends that are not in the new list
    const toDelete = Array.from(existingNames).filter(name => !newNames.has(name));
    if (toDelete.length > 0) {
        const deleteStmt = db.prepare("DELETE FROM backend WHERE name = ?");
        for (const name of toDelete) {
            deleteStmt.run(name);
        }
        hasUpdates = true;
    }

    // Upsert the new backends
    for (const backend of bdata) {
        const stmt1 = db.prepare("SELECT * FROM backend WHERE name = ?");
        const result = stmt1.get(backend.name) as Record<string, any>;

        if (result?.id) {
            const updateStmt = db.prepare("UPDATE backend SET type = ?, url = ?, apiKey = ?, isdefault = ? WHERE name = ?");
            updateStmt.run(backend.type, backend.url, backend?.apiKey ?? "NULL", backend.isDefault ? 1 : 0, backend.name);
            hasUpdates = true;
        } else {
            const stmt = db.prepare("INSERT INTO backend (name,type,url,apiKey,isdefault) VALUES (?,?,?,?,?)");
            stmt.run(backend.name, backend.type, backend.url, backend?.apiKey ?? "NULL", backend.isDefault ? 1 : 0);
            hasUpdates = true;
        }
    }

    return hasUpdates;
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

function updateVariables(name: string, variableDoc: string) {
    const stmt1 = db.prepare("SELECT id FROM task WHERE name = ?");
    const result = stmt1.get(name) as Record<string, any>;
    //console.log("UV res", result);
    if (!result?.id) {
        return;
    }
    const updateStmt = db.prepare("UPDATE task SET variables = ? WHERE id = ?");
    updateStmt.run(variableDoc, result.id);
    console.log("~", "[task variables] updated for", name);
}

function upsertTool(name: string, type: FeatureType, toolDoc: string) {
    const stmt1 = db.prepare("SELECT * FROM tool WHERE name = ?");
    const result = stmt1.get(name) as Record<string, any>;
    if (result?.id) {
        // Update the existing tool
        const updateStmt = db.prepare("UPDATE tool SET spec = ?, type = ? WHERE id = ?");
        updateStmt.run(toolDoc, type, result.id);
        console.log("~", "[tool] updated from", type, ":", name);
    } else {
        // Insert a new tool
        const stmt = db.prepare("INSERT INTO tool (name, spec, type) VALUES (?,?,?)");
        stmt.run(name, toolDoc, type);
        console.log("+", "[tool] added from", type, ":", name);
    }
}

function updateModels(models: Array<DbModelDef>) {
    const allDbModels = readModels();
    //console.log("ADB", allDbModels.length);
    const existingModelShortNames = allDbModels.map(row => row.shortname) as Array<string>;
    const newModelShortNames = models.filter(m => !existingModelShortNames.includes(m.shortname)).map(m => m.shortname);
    //console.log("Existing models", existingModelShortNames, existingModelShortNames.length);
    //console.log("New models", newModelShortNames);
    // Identify models to delete
    const mm = models.map(m => m.shortname);
    const modelsToDelete = existingModelShortNames.filter(name => !mm.includes(name));
    //console.log("Models to delete", modelsToDelete);
    db.transaction(() => {
        // Insert or update models
        for (const model of models) {
            if (!existingModelShortNames.includes(model.shortname)) {
                // Insert the new model
                const insertStmt = db.prepare("INSERT INTO model (name, shortname, data) VALUES (?, ?, ?)");
                insertStmt.run(model.name, model.shortname, JSON.stringify(model.data));
                console.log("+", "[model]", model.name);
            } else {
                // Update the existing model
                const updateStmt = db.prepare("UPDATE model SET name = ?, data = ? WHERE shortname = ?");
                updateStmt.run(model.name, JSON.stringify(model.data), model.shortname);
            }
        }
        // Delete models that are not in the new list
        for (const name of modelsToDelete) {
            const deleteStmt = db.prepare("DELETE FROM model WHERE shortname = ?");
            deleteStmt.run(name);
            console.log("-", "[model]", name);
        }
    })();
}

function updateFeatures(feats: Features) {
    //console.log("FEATS", feats);
    upsertAndCleanFeatures(feats.task, "task");
    feats.task.forEach((feat) => {
        const { toolDoc, variables } = extractTaskToolDocAndVariables(feat.name, feat.ext, feat.path);
        //const { found, toolDoc } = extractToolDoc(feat.name, feat.ext, feat.path);
        //console.log(`TASK ${feat.name} TOOL DOC`, toolDoc);
        if (toolDoc.length > 0) {
            upsertTool(feat.name, "task", toolDoc)
        }
        if (Object.keys(variables.required).length > 0 || Object.keys(variables.optional).length > 0) {
            //console.log("UPDATE VARS", feat.name, ":", variables)
            updateVariables(feat.name, JSON.stringify(variables, null, "  "))
        }
    });
    upsertAndCleanFeatures(feats.action, "action");
    feats.action.forEach((feat) => {
        const { found, toolDoc } = extractToolDoc(feat.name, feat.ext, feat.path);
        //console.log(`ACTION ${feat.name} TOOL DOC`, toolDoc);
        if (found) {
            upsertTool(feat.name, "action", toolDoc)
        }
    });
    upsertAndCleanFeatures(feats.workflow, "workflow");
    feats.workflow.forEach((feat) => {
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

function upsertFilePath(name: string, newPath: string): boolean {
    const selectStmt = db.prepare("SELECT * FROM filepath WHERE name = ?");
    const result = selectStmt.get(name) as Record<string, any>;

    if (result?.id) {
        // If the filepath exists, update it
        const q = `UPDATE filepath SET path = ? WHERE name = ?`;
        const stmt = db.prepare(q);
        const updateResult = stmt.run(newPath, name);
        return updateResult.changes > 0;
    } else {
        // If the filepath does not exist, insert it
        const insertStmt = db.prepare("INSERT INTO filepath (name, path) VALUES (?, ?)");
        insertStmt.run(name, newPath);
        return true;
    }
}

export {
    updatePromptfilePath,
    updateDataDirPath,
    upsertBackends,
    setDefaultBackend,
    insertFeaturesPathIfNotExists,
    insertPluginIfNotExists,
    updateFeatures,
    updateAliases,
    cleanupFeaturePaths,
    updateModels,
    upsertFilePath,
}
