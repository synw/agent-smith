import { useAgentTask, useAgentJob } from "@agent-smith/jobs";

const readDir = async (params) => {
    const result = {};
    try {
        const files = await fs.promises.readdir(params[0], { withFileTypes: true });
        for (const file of files) {
            if (file.isFile()) {
                const filePath = path.join(dirPath, file.name);
                const content = await fs.promises.readFile(filePath, 'utf8');
                result[file.name] = content;
            }
        }
    } catch (err) {
        console.error('Error reading directory:', err);
    }
    return result
};

function translateFiles(files) {
    for (const [name, content] of Object.entries(files)) {

    }
}

const readDirTask = useAgentTask({
    id: "readir",
    title: "Read a directory files content",
    run: readDir,
});

const job = [
    useAgentJob({
        name: "translatedir",
        title: "Translate a directory",
        tasks: [readDirTask,]
    }),
];

export { job }