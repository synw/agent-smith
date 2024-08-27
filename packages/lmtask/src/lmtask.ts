import { default as fs } from "fs";
import { default as path } from "path";
import YAML from 'yaml';
import { type AgentBrain } from "@agent-smith/brain";
import { AgentTask, AgentTaskSpec, useAgentTask } from "@agent-smith/jobs";
import { PromptTemplate } from "modprompt";
import { LmTask } from "./interfaces.js";

/**
 * `useLmTask` is a function that provides a set of utilities for managing language model tasks.
 *
 * @param {AgentBrain} brain - The brain object that contains the language model experts.
 * @returns {{
 *   init: (taskPath: string) => AgentTask,
 *   read: (taskPath: string) => { found: boolean, task: LmTask },
 *   readDir: (dir: string) => Array<string>
 * }} An object containing the `init`, `read`, and `readDir` functions.
 *
 * @example
 * const lmTask = useLmTask(brain);
 * const task = lmTask.init('path/to/task');
 * const {task, found} = lmTask.read('path/to/task');
 * const tasks = lmTask.readDir('path/to/directory');
 */
const useLmTask = (brain: AgentBrain): {
    init: (taskPath: string) => AgentTask,
    read: (taskPath: string) => { found: boolean, task: LmTask },
    readDir: (dir: string) => Array<string>
} => {
    /**
     * Reads all files in a directory that have a .yml extension and returns an array of their filenames.
     * @param {string} dir - The path to the directory containing the yaml files.
     * @returns {Array<string>} An array of filenames with a .yml extension found in the specified directory.
     */
    const readDir = (dir: string): Array<string> => {
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

    /**
     * Reads a task from a file.
     *
     * @param {string} taskpath - The path to the task file.
     * @returns {{ found: boolean, task: LmTask }} An object containing whether or not the task was found and the task data itself. 
     * If no task is found at the provided path, an empty `LmTask` object will be returned.
     *
     * @example
     * const {task, found} = readTask('/path/to/your/task.yml');
     * if (found) {
     *   console.log('Task Found:', task);
     * } else {
     *   console.log('No Task Found at the provided path.');
     * }
     */
    const read = (taskpath: string): { found: boolean, task: LmTask } => {
        if (!fs.existsSync(taskpath)) {
            return { task: {} as LmTask, found: false }
        }
        const file = fs.readFileSync(taskpath, 'utf8');
        const data = YAML.parse(file);
        //console.log("READ TASK", data);
        return { task: data, found: true }
    }

    /**
     * Reads a language model task from a file and returns an AgentTask object.
     * 
     * @param {string} taskPath - The path to the task file.
     * @returns {AgentTask}
     * @throws Will throw an error if the task is not found at the given path.
     * @example
     * const lmTask = useLmTask(brain);
     * const task = lmTask.read('path/to/task');
     */
    const init = (taskPath: string): AgentTask => {
        const { found, task } = read(taskPath);
        if (!found) {
            throw new Error(`Task ${taskPath} not found`)
        }
        //console.log("TASK", task);
        const ts: AgentTaskSpec = {
            id: task.name,
            title: task.description,
            run: async (params: Record<string, string>) => {
                if (!params?.prompt) {
                    throw new Error("Please provide a prompt parameter");
                }
                let prompt = params.prompt;
                const tvars = params;
                delete tvars.prompt;
                let overrideModel = false;
                const modelOverride = { model: "", template: "" };
                if (tvars?.m) {
                    overrideModel = true;
                    const _s = tvars.m.split("/");
                    modelOverride.model = _s[0];
                    modelOverride.template = _s[1];
                    delete tvars.m;
                    //console.log("MO", modelOverride);
                }
                //console.log("Running task", task.name, ", params:", params);
                //console.log("Prompt", prompt);
                //console.log("Vars", tvars);
                const modelName = overrideModel ? modelOverride.model : task.model.name;
                const expert = brain.getExpertForModel(modelName);
                if (!expert) {
                    return { error: `Expert for model ${modelName} not found` }
                }
                const ex = brain.expert(expert);
                if (ex.lm.providerType == "ollama") {
                    if (ex.lm.model.name != modelName) {
                        await ex.lm.loadModel(modelName);
                    }
                } else if (ex.lm.model.name != modelName) {
                    throw new Error(`The ${modelName} model is not loaded on server (currently ${ex.lm.model.name})`)
                }
                const templateName = overrideModel ? modelOverride.template : task.template.name;
                const tpl = new PromptTemplate(templateName);
                if (task.template?.stop) {
                    const defaultStop = tpl?.stop ?? [];
                    tpl.stop = [...defaultStop, ...task.template.stop];
                }
                if (task.template?.system) {
                    tpl.replaceSystem(task.template.system)
                }
                if (task.template?.assistant) {
                    tpl.afterAssistant(task.template.assistant)
                }
                if (task.shots) {
                    task.shots.forEach((s) => tpl.addShot(s.user, s.assistant));
                }
                //const _p = task.prompt.replace("{prompt}", args[0]);
                for (const [k, v] of Object.entries(tvars)) {
                    task.prompt = task.prompt.replace(`{${k}}`, v);
                }
                tpl.replacePrompt(task.prompt)
                const pr = tpl.prompt(prompt);
                //console.log("PR", pr);
                //console.log("PARAMS", task.inferParams)
                if (ex.lm.providerType == "ollama") {
                    // tell Ollama to apply no template
                    if (!task.inferParams?.extra) {
                        task.inferParams.extra = { "raw": true }
                    } else {
                        task.inferParams.extra["raw"] = true
                    }
                }
                const res = await ex.think(pr, { ...task.inferParams, stream: true });
                return res
            },
            abort: async (): Promise<void> => {
                const expert = brain.getExpertForModel(task.model.name);
                if (!expert) {
                    console.error(`Expert for model ${task.model.name} not found, can not abort`);
                    return
                }
                const ex = brain.expert(expert);
                await ex.abortThinking()
            }
        }
        return useAgentTask(ts);
    }

    return {
        init,
        read,
        readDir,
    }
}

export { useLmTask };
