import { executeTaskCmd, initAgent, initState, usePerfTimer, parseInferenceArgs } from "../../../../../cli/dist/main.js";
import { step1SelectData } from "./steps/step1.js";
import { bookmarkExists, countBookmarks, initDb, insertBookmark } from "./db.js";
import { Bookmark } from "../interfaces.js";

async function runCmd(args: Array<string>, opts: Record<string, any>) {
    // check args
    if (args.length == 0) {
        console.warn("🔴 Provide a bookmarks file path")
    }
    //const isDebug = opts?.d === true;
    const timer = usePerfTimer();
    const filePath = args[0];
    // init cli
    await initState();
    await initDb();
    //console.table(bms.map(b => b.uri));
    console.log("Found", countBookmarks(), "in the database");
    const isUp = await initAgent();
    if (!isUp) {
        throw new Error("No inference server found, canceling")
    }
    const data = await step1SelectData(filePath);
    const { inferenceVars } = parseInferenceArgs(args);
    console.log(`Processing ${data.length} bookmarks`);
    let i = 1;
    let nProc = 0;
    let final = new Array<Record<string, any>>();
    for (const bm of data) {
        console.log();
        console.log(i, bm.uri);
        console.log(bm.title);
        // check if the bookmark exists
        const exists = await bookmarkExists(bm.uri);
        if (exists) {
            console.log(`${bm.uri} exists in db, skipping`);
            ++i;
            continue
        }
        // process bookmark
        const bmData = {
            title: bm.title,
            uri: bm.uri,
        };
        const res = await executeTaskCmd(
            { name: "classify-bookmark", prompt: JSON.stringify(bmData, null, "  "), ...inferenceVars },
            //{ onToken: (t: string) => null }
        );
        const resp = JSON.parse(res.answer.text);
        // insert into db
        const vecData = bm.title + " " + resp.keywords;
        //console.log("RESP", resp);
        const fbm: Bookmark = {
            title: bm.title,
            text: vecData,
            uri: bm.uri,
            keywords: resp.keywords,
            topics: resp.topics,
            programming_language: resp?.programming_language ?? "",
            project_name: resp?.project_name ?? "",
            is_github_repository: resp.is_github_repository,
            is_huggingface_repository: resp.is_huggingface_repository,
        };
        console.log(`inserting ${bm.uri} in db`);
        await insertBookmark(fbm);
        // end
        final.push({
            ...bmData,
            ...resp,
        });
        nProc++;
        i++
    }
    console.log(nProc, "bookmarks processed");
    timer.printTime();
}

const cmd = {
    cmd: runCmd,
    description: "Process a bookmarks file",
};

export { cmd }