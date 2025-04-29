import { useSmem } from "../../../../../smem/dist/main.js";
import { pluginDataDir } from "../../../../../../packages/cli/dist/main.js";
let mem;
let node;
let isReady = false;
const schema = [
    { name: "title", type: "string" },
    { name: "text", type: "string" },
    { name: "uri", type: "string" },
    { name: "keywords", type: "string" },
    { name: "topics", type: "string" },
    { name: "programming_language", type: "string" },
    { name: "project_name", type: "string" },
    { name: "is_github_repository", type: "boolean" },
    { name: "is_huggingface_repository", type: "boolean" },
];
async function initDb(isVerbose = false) {
    if (isReady) {
        return;
    }
    mem = useSmem(isVerbose);
    const dir = pluginDataDir("bookmarks");
    await mem.init(dir);
    node = await mem.node("bookmarks", schema, "text");
    isReady = true;
}
async function bookmarkExists(uri) {
    let res = await node.table.query().where(`uri = '${uri}'`).toArray();
    return res.length > 0;
}
async function readBookmarks(limit = 0) {
    if (limit > 0) {
        const res = await node.table.query().select(["text"]).limit(limit).toArray();
        return res;
    }
    return await node.table.query().select(["text"]).toArray();
}
async function searchBookmarks(q, limit = 10, filters) {
    const sp = { limit: limit, filters: filters ?? [], select: ["text", "uri", "keywords"] };
    const res = await node.search(q, sp);
    return res;
}
async function filterBookmarks(q, limit = 10, field = "keywords") {
    const res = node.table.query().where(`${field} LIKE '%${q}%'`)
        .limit(limit)
        .select(["uri", "text", "keywords"]);
    return res.toArray();
}
async function countBookmarks() {
    return await node.table.countRows();
}
async function insertBookmark(bm) {
    await node.add([bm]);
}
export { mem, initDb, bookmarkExists, insertBookmark, readBookmarks, countBookmarks, searchBookmarks, filterBookmarks, };
