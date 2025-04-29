import color from "ansi-colors";
import { Bookmark } from "../interfaces.js";
import { countBookmarks, filterBookmarks, initDb, readBookmarks, searchBookmarks } from "../lib/db.js";
import { cmd } from "../lib/processbookmarks.js";

async function action(args: Array<string>) {
    if (args.length == 0) {
        throw new Error("provide a command")
    }
    const cmdName = args[0];
    await initDb();
    switch (cmdName) {
        case "show":
            let bms: Array<Bookmark>;
            if (args.length > 1) {
                bms = await readBookmarks(parseInt(args[1]));
            } else {
                bms = await readBookmarks();
            }
            console.table(bms);
            break;
        case "count":
            console.log(`Found ${await countBookmarks()} bookmarks in the database`);
            break;
        case "ingest":
            await cmd.cmd([args[1]], {});
            break;
        case "search":
            if (args.length < 2) {
                throw new Error("provide a query")
            }
            const q = args[1];
            let limit: number;
            let res: Array<Bookmark>;
            //console.log("ARGS", args);
            if (args.length == 4) {
                limit = parseInt(args[2]);
                res = await searchBookmarks(q, limit, [args[3]])
            } else {
                res = await searchBookmarks(q)
            }
            _print(res);
            break
        case "filter":
            if (args.length < 2) {
                throw new Error("provide a query")
            }
            const q2 = args[1];
            let limit2: number;
            let res2: Array<Bookmark>;
            if (args.length == 3) {
                limit2 = parseInt(args[2]);
                res2 = await filterBookmarks(q2, limit2)
            } else {
                res2 = await filterBookmarks(q2)
            }
            _print(res2);
            break
        default:
            throw new Error("Unknown command");
    }
}

function _print(res: Array<Bookmark>) {
    res.forEach((row) => {
        const buf = new Array<string>();
        // @ts-ignore        
        if (row?._distance) {
            buf.push(color.yellow(`${row._distance.toFixed(2)} `));
        }

        buf.push(color.bold(row.uri) + ": " + row.text);
        if (row?.keywords) {
            buf.push(color.dim(" (" + row.keywords + ")"))
        }
        console.log(buf.join(""))
    })
}

export { action }