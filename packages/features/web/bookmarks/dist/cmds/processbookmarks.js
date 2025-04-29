import { executeActionCmd, executeTaskCmd, initAgent, initState, usePerfTimer } from "../../../../../cli/dist/main.js";
import { step1SelectData } from "../lib/steps/step1.js";
import { bookmarkExists, countBookmarks, initDb, insertBookmark, readBookmarks } from "../lib/db.js";
function parseInferenceArgs(args) {
    const vars = {};
    args.forEach((a) => {
        if (a.includes("=")) {
            const t = a.split("=");
            const k = t[0];
            const v = t[1];
            switch (k) {
                case "m":
                    if (v.includes("/")) {
                        const _s = v.split("/");
                        vars.model = _s[0];
                        vars.template = _s[1];
                    }
                    else {
                        vars.model = v;
                    }
                    break;
                case "ip":
                    v.split(",").forEach((p) => {
                        const s = p.split(":");
                        vars["inferParams"][s[0]] = parseFloat(s[1]);
                    });
                    break;
                case "s":
                    vars.size = v;
                    break;
                default:
                    vars[k] = v;
                    break;
            }
        }
    });
    return vars;
}
async function runCmd(args = new Array, opts) {
    if (args.length == 0) {
        console.warn("🔴 Provide a bookmarks file path");
    }
    const isDebug = opts?.d === true;
    const timer = usePerfTimer();
    const filePath = args[0];
    await initState();
    await initDb();
    const bms = await readBookmarks();
    console.log("Found", countBookmarks(), "in the database");
    const isUp = await initAgent();
    if (!isUp) {
        throw new Error("No inference server found, canceling");
    }
    const data = await step1SelectData(filePath);
    const nextArgs = parseInferenceArgs(args);
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
        const res = await executeTaskCmd({ name: "classify-bookmark", prompt: JSON.stringify(bmData, null, "  "), ...nextArgs });
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
    const p = "/home/ggg/dev/apps/lmbookmarks/run4.json";
    await executeActionCmd(["writetofile", JSON.stringify(final, null, "  "), p]);
    return "";
}
const cmd = {
    cmd: runCmd,
    description: "Process a bookmarks file",
};
export { cmd };
