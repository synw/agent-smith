import DatabaseConstructor, { Database } from "better-sqlite3";
import { schemas } from "./schemas.js";
import path from "path";

// @ts-ignore
const confDir = path.join(process.env.HOME, ".config/agent-smith/cli");
const dbPath = path.join(confDir, "config.db");
let db: Database;

function initDb(isVerbose = false) {
    db = new DatabaseConstructor(dbPath, { fileMustExist: false });
    schemas.forEach((s) => {
        db.exec(s);
        if (isVerbose) {
            console.log(`Schema executed: ${s}`)
        }
    });
}

export {
    db,
    dbPath,
    initDb,
}