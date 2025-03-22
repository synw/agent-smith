import { default as fs } from "fs";
import { default as path } from "path";

function readTask(taskpath: string): { found: boolean, ymlTask: string } {
    if (!fs.existsSync(taskpath)) {
        return { ymlTask: "", found: false }
    }
    const data = fs.readFileSync(taskpath, 'utf8');
    return { ymlTask: data, found: true }
}

function readTasksDir(dir: string): Array<string> {
    const tasks = new Array<string>();
    fs.readdirSync(dir).forEach((filename) => {
        const filepath = path.join(dir, filename);
        const isDir = fs.statSync(filepath).isDirectory();
        if (!isDir) {
            if (filename.endsWith(".yml")) {
                tasks.push(filename)
            }
        }
    });
    return tasks
}

export {
    readTask,
    readTasksDir,
}