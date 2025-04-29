import { Smem, SmemNodeSchema, useSmem, SmemNode } from "../../../../../smem/dist/main.js";
import { pluginDataDir } from "../../../../../../packages/cli/dist/main.js";
import { Bookmark } from "../interfaces.js";
import { SearchParams } from "../../../../../smem/dist/smeminterfaces.js";
//import { RRFReranker } from "@lancedb/lancedb/dist/rerankers/index.js"

let mem: Smem;
let node: SmemNode<Bookmark>;
let isReady = false;

const schema: SmemNodeSchema = [
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
    if (isReady) { return }
    mem = useSmem(isVerbose);
    const dir = pluginDataDir("bookmarks");
    await mem.init(dir);
    node = await mem.node<Bookmark>("bookmarks", schema, "text");
    isReady = true
}

async function bookmarkExists(uri: string): Promise<boolean> {
    let res = await node.table.query().where(`uri = '${uri}'`).toArray();
    //console.log("BME", res);
    return res.length > 0
}

async function readBookmarks(limit = 0): Promise<Array<Bookmark>> {
    if (limit > 0) {
        const res = await node.table.query().select(["text"]).limit(limit).toArray();
        return res
    }
    return await node.table.query().select(["text"]).toArray();
}

async function searchBookmarks(q: string, limit = 10, filters?: string[]): Promise<Array<Bookmark>> {
    const sp: SearchParams = { limit: limit, filters: filters ?? [], select: ["text", "uri", "keywords"] };
    const res = await node.search(q, sp);
    return res as Array<Bookmark>;
}

async function filterBookmarks(q: string, limit = 10, field = "keywords"): Promise<Array<Bookmark>> {
    const res = node.table.query().where(`${field} LIKE '%${q}%'`)
        .limit(limit)
        .select(["uri", "text", "keywords"])
    return res.toArray();

}

async function countBookmarks(): Promise<number> {
    return await node.table.countRows()
}

async function insertBookmark(bm: Bookmark) {
    await node.add([bm])
}

export {
    mem,
    initDb,
    bookmarkExists,
    insertBookmark,
    readBookmarks,
    countBookmarks,
    searchBookmarks,
    filterBookmarks,
}
