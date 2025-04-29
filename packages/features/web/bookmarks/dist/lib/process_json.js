function printTree(node, indent = '') {
    if (node.title.length > 0) {
        console.log(indent + node.title, "(", node.nLeaf, ")");
    }
    if (node?.children) {
        node.children.forEach(child => {
            printTree(child, indent + '    ');
        });
    }
}
function parseHierarchy(bookmark) {
    if (!bookmark || typeof bookmark !== 'object')
        return null;
    if (!bookmark?.children) {
        return null;
    }
    const node = {
        title: bookmark.title,
        id: bookmark.id,
        nLeaf: bookmark?.children.length ?? 0,
        children: bookmark?.children,
    };
    if (Array.isArray(bookmark.children) && bookmark.children.length > 0) {
        node.children = bookmark.children
            .map((child) => parseHierarchy(child))
            .filter((child) => child !== null);
    }
    return node;
}
function findNodeById(node, targetId) {
    if (node.id === targetId) {
        return node;
    }
    if (node?.children) {
        for (const child of node.children) {
            const result = findNodeById(child, targetId);
            if (result !== null) {
                return result;
            }
        }
    }
    return null;
}
export { parseHierarchy, printTree, findNodeById };
