interface BookmarkFolderNode {
    title: string;
    id: number;
    nLeaf: number;
    children: BookmarkFolderNode[];
}

interface Bookmark {
    title: string;
    text: string;
    uri: string;
    keywords: string;
    topics: string;
    programming_language: string;
    project_name: string;
    is_github_repository: boolean;
    is_huggingface_repository: boolean;
    _distance?: number;
}

export {
    BookmarkFolderNode,
    Bookmark,
}