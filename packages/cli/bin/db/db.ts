import DatabaseConstructor, { Database } from "better-sqlite3";
import { schemas } from "./schemas.js";
import { dbPath } from "../conf.js";

let db: Database;

function initDb(isVerbose = false) {
    db = new DatabaseConstructor(dbPath);
    schemas.forEach((s) => {
        db.exec(s);
        if (isVerbose) {
            console.log(`Schema executed: ${s}`)
        }
    });
}

export {
    db,
    initDb,
}