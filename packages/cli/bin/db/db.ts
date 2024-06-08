import DatabaseConstructor, { Database } from "better-sqlite3";
import { schemas } from "./schemas.js";
import { checkConf, dbPath } from "../conf.js";
import { insertDefaultFilepaths } from "./write.js";


checkConf()
let db = new DatabaseConstructor(dbPath,
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