import { default as fs } from "fs";
import { findNodeById, parseHierarchy, printTree } from "../../lib/process_json.js";
import { selectFolders } from "../../lib/select_folder.js";
import { BookmarkFolderNode } from "../../interfaces.js";

async function step1SelectData(filePath: string): Promise<Array<Record<string, any>>> {
    // open and parse the file
    let content = "";
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        throw new Error(`reading file ${e}}`)
    }
    let res: Array<any> | Record<string, any>;
    try {
        res = JSON.parse(content);
    } catch (e) {
        throw new Error(`Error parsing json ${e}`)
    }
    // parse the folders hierarchy
    const hierarchy = parseHierarchy(res);
    if (!hierarchy) {
        throw new Error(`no bookmarks found in file`)
    }
    //console.log("H", JSON.stringify(hierarchy?.children, null, "  "))
    console.log(" Found bookmark folders:\n")
    // @ts-ignore
    console.log(printTree(hierarchy));
    // select folder
    // @ts-ignore
    const foldersIds = await selectFolders(hierarchy);
    //console.log("FA", foldersIds);
    const data = new Array<Record<string, any>>();
    foldersIds.forEach((fid) => {
        const bm = res as BookmarkFolderNode;
        const node = findNodeById(bm, parseInt(fid));
        if (!node) {
            throw new Error(`node ${bm.title}`)
        }
        //console.log(fid, node?.children.length);
        if (!node?.children) {
            throw new Error(`no bookmarks in ${node?.title}`)
        }
        data.push(...node.children)
    });
    return data
}

export { step1SelectData }