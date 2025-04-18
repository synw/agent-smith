import DatabaseConstructor, { Database } from "better-sqlite3";
import { schemas } from "./schemas.js";
import path from "path";
import { createDirectoryIfNotExists } from "../cmd/sys/dirs.js";

const confDir = path.join(process.env.HOME ?? "~/", ".config/agent-smith/cli");
const dbPath = path.join(confDir, "config.db");
let db: Database;

function initDb(isVerbose: boolean, execSchema = false) {
    if (execSchema) {
        createDirectoryIfNotExists(confDir, true);
        db = new DatabaseConstructor(dbPath, { fileMustExist: false });
        schemas.forEach((s) => {
            db.exec(s);
            if (isVerbose) {
                console.log(`Schema executed: ${s}`)
            }
        });
    } else {
        db = new DatabaseConstructor(dbPath);
    }
}

export {
    db,
    dbPath,
    initDb,
}