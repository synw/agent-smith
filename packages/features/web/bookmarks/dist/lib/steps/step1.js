import { default as fs } from "fs";
import { findNodeById, parseHierarchy, printTree } from "../../lib/process_json.js";
import { selectFolders } from "../../lib/select_folder.js";
async function step1SelectData(filePath) {
    let content = "";
    try {
        content = fs.readFileSync(filePath, 'utf8');
    }
    catch (e) {
        throw new Error(`reading file ${e}}`);
    }
    let res;
    try {
        res = JSON.parse(content);
    }
    catch (e) {
        throw new Error(`Error parsing json ${e}`);
    }
    const hierarchy = parseHierarchy(res);
    if (!hierarchy) {
        throw new Error(`no bookmarks found in file`);
    }
    console.log(" Found bookmark folders:\n");
    console.log(printTree(hierarchy));
    const foldersIds = await selectFolders(hierarchy);
    const data = new Array();
    foldersIds.forEach((fid) => {
        const bm = res;
        const node = findNodeById(bm, parseInt(fid));
        if (!node) {
            throw new Error(`node ${bm.title}`);
        }
        if (!node?.children) {
            throw new Error(`no bookmarks in ${node?.title}`);
        }
        data.push(...node.children);
    });
    return data;
}
export { step1SelectData };
