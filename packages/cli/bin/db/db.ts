import DatabaseConstructor, { Database } from "better-sqlite3";
import { schemas } from "./schemas.js";
import { createConfDirIfNotExists, dbPath } from "../conf.js";
import { insertDefaultFilepaths } from "./write.js";


createConfDirIfNotExists();
let db: Database = new DatabaseConstructor(dbPath,
    //{ verbose: console.log }
);

function initDb(isVerbose = false) {
    schemas.forEach((s) => {
        db.exec(s);
        if (isVerbose) {
            console.log(`Schema executed: ${s}`)
        }
    });
}

function dbPopulateDefaults() {
    insertDefaultFilepaths()
}

export {
    db,
    initDb,
    dbPopulateDefaults,
}