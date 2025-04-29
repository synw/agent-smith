import { BookmarkFolderNode } from "../interfaces.js";

function printTree(node: BookmarkFolderNode, indent = '') {
    //console.log("N", node);
    if (node.title.length > 0) {
        console.log(indent + node.title, "(", node.nLeaf, ")");
    }
    if (node?.children) {
        node.children.forEach(child => {
            //console.log("C", child);
            printTree(child, indent + '    ')
        });
    }
}

function parseHierarchy(bookmark: any): BookmarkFolderNode | null {
    if (!bookmark || typeof bookmark !== 'object') return null;
    if (!bookmark?.children) {
        return null
    }
    const node: BookmarkFolderNode = {
        title: bookmark.title,
        id: bookmark.id,
        nLeaf: bookmark?.children.length ?? 0,
        children: bookmark?.children,
    };
    if (Array.isArray(bookmark.children) && bookmark.children.length > 0) {
        node.children = bookmark.children
            .map((child: any) => parseHierarchy(child)) // Specify the type of child as `any`
            .filter((child: any): child is BookmarkFolderNode => child !== null);
    }
    return node;
}

function findNodeById(node: BookmarkFolderNode, targetId: number): Record<string, any> | null {
    if (node.id === targetId) {
        return node as Record<string, any>;
    }
    if (node?.children) {
        for (const child of node.children) {
            const result = findNodeById(child, targetId);
            if (result !== null) {
                return result as Record<string, any>;
            }
        }
    }
    return null;
}


export { parseHierarchy, printTree, findNodeById }