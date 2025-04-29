import { checkbox } from '@inquirer/prompts';
function flattenBookmarkFolderNodes(node) {
    const result = [node];
    for (const child of node.children) {
        result.push(...flattenBookmarkFolderNodes(child));
    }
    return result;
}
async function selectFolders(hierarchy) {
    const data = flattenBookmarkFolderNodes(hierarchy);
    data.shift();
    const choices = [];
    data.forEach((f) => {
        choices.push({
            value: f.id.toString(),
            name: f.title,
        });
    });
    console.log();
    const answer = await checkbox({
        message: 'Select bookmark folders to be processed',
        choices: choices,
    });
    return answer;
}
export { selectFolders, };
