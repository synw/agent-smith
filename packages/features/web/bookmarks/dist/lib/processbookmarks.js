import { executeTaskCmd, initAgent, initState, usePerfTimer, parseInferenceArgs } from "../../../../../cli/dist/main.js";
import { step1SelectData } from "./steps/step1.js";
import { bookmarkExists, countBookmarks, initDb, insertBookmark } from "./db.js";
async function runCmd(args, opts) {
    if (args.length == 0) {
        console.warn("🔴 Provide a bookmarks file path");
    }
    const timer = usePerfTimer();
    const filePath = args[0];
    await initState();
    await initDb();
    console.log("Found", countBookmarks(), "in the database");
    const isUp = await initAgent();
    if (!isUp) {
        throw new Error("No inference server found, canceling");
    }
    const data = await step1SelectData(filePath);
    const { inferenceVars } = parseInferenceArgs(args);
    console.log(`Processing ${data.length} bookmarks`);
    let i = 1;
    let nProc = 0;
    let final = new Array();
    for (const bm of data) {
        console.log();
        console.log(i, bm.uri);
        console.log(bm.title);
        const exists = await bookmarkExists(bm.uri);
        if (exists) {
            console.log(`${bm.uri} exists in db, skipping`);
            ++i;
            continue;
        }
        const bmData = {
            title: bm.title,
            uri: bm.uri,
        };
        const res = await executeTaskCmd({ name: "classify-bookmark", prompt: JSON.stringify(bmData, null, "  "), ...inferenceVars });
        const resp = JSON.parse(res.answer.text);
        const vecData = bm.title + " " + resp.keywords;
        const fbm = {
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
        final.push({
            ...bmData,
            ...resp,
        });
        nProc++;
        i++;
    }
    console.log(nProc, "bookmarks processed");
    timer.printTime();
}
const cmd = {
    cmd: runCmd,
    description: "Process a bookmarks file",
};
export { cmd };
