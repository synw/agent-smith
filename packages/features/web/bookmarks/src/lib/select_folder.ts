import { checkbox } from '@inquirer/prompts';
import { BookmarkFolderNode } from '../interfaces.js';

function flattenBookmarkFolderNodes(node: BookmarkFolderNode): BookmarkFolderNode[] {
    const result: BookmarkFolderNode[] = [node];
    for (const child of node.children) {
        result.push(...flattenBookmarkFolderNodes(child));
    }
    return result;
}

async function selectFolders(hierarchy: BookmarkFolderNode) {
    const data = flattenBookmarkFolderNodes(hierarchy);
    data.shift();
    const choices: { value: string; name?: string; description?: string; disabled?: boolean }[] = [];
    data.forEach((f) => {
        choices.push({
            value: f.id.toString(),
            name: f.title,
        })
    });
    console.log();
    const answer = await checkbox({
        message: 'Select bookmark folders to be processed',
        choices: choices,
    });
    //console.log("A", answer);
    return answer
}

export {
    selectFolders,
}