import { ActionExtension, CmdExtension, Features, JobExtension, TaskExtension, WorkflowExtension } from "../../interfaces.js";
import { default as fs } from "fs";
import { default as path } from "path";

function _readDir(dir: string, ext: Array<string>): Array<string> {
    const fileNames = new Array<string>;
    fs.readdirSync(dir).forEach((filename) => {
        const filepath = path.join(dir, filename);
        //console.log("F", filepath);
        const isDir = fs.statSync(filepath).isDirectory();
        if (!isDir) {
            for (let extension of ext) {
                if (filename.endsWith(extension)) {
                    fileNames.push(filename)
                }
            }
        }
    });
    return fileNames
}

function readFeaturesDir(dir: string): Features {
    const feats: Features = {
        task: [],
        job: [],
        action: [],
        cmd: [],
        workflow: []
    }
    let dirpath = path.join(dir, "tasks");
    if (fs.existsSync(dirpath)) {
        const data = _readDir(dirpath, [".yml"]);
        data.forEach((filename) => {
            const parts = filename.split(".");
            const ext = parts.pop()!;
            const name = parts.join("");
            feats.task.push({
                name: name,
                path: path.join(dirpath),
                ext: ext as TaskExtension,
            })
        });
    }
    dirpath = path.join(dir, "jobs");
    if (fs.existsSync(dirpath)) {
        const data = _readDir(dirpath, [".yml"]);
        data.forEach((filename) => {
            const parts = filename.split(".");
            const ext = parts.pop()!;
            const name = parts.join("");
            feats.job.push({
                name: name,
                path: path.join(dirpath),
                ext: ext as JobExtension,
            })
        });
    }
    dirpath = path.join(dir, "workflows");
    if (fs.existsSync(dirpath)) {
        const data = _readDir(dirpath, [".yml"]);
        data.forEach((filename) => {
            const parts = filename.split(".");
            const ext = parts.pop()!;
            const name = parts.join("");
            feats.workflow.push({
                name: name,
                path: path.join(dirpath),
                ext: ext as WorkflowExtension,
            })
        });
    }
    dirpath = path.join(dir, "actions")
    if (fs.existsSync(dirpath)) {
        const data = _readDir(dirpath, ["yml", ".js", "mjs", ".py"]);
        data.forEach((filename) => {
            const parts = filename.split(".");
            const ext = parts.pop()!;
            const name = parts.join("");
            feats.action.push({
                name: name,
                path: path.join(dirpath),
                ext: ext as ActionExtension,
            })
        });
    }
    dirpath = path.join(dir, "cmds");
    if (fs.existsSync(dirpath)) {
        const data = _readDir(dirpath, [".js"]);
        data.forEach((filename) => {
            const parts = filename.split(".");
            const ext = parts.pop()!;
            const name = parts.join("");
            feats.cmd.push({
                name: name,
                path: path.join(dirpath),
                ext: ext as CmdExtension,
            })
        });
    }
    return feats
}

export { readFeaturesDir }