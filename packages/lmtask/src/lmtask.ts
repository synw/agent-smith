import { type AgentBrain } from "@agent-smith/brain";
import { AgentTask, AgentTaskSpec, useAgentTask } from "@agent-smith/jobs";
import { PromptTemplate } from "modprompt";
import { readTask } from "./utils.js";

/**
 * A hook that provides a language model task.
 *
 * @param {AgentBrain} brain - The agent brain instance to use.
 * @returns {{ read: (taskPath: string) => AgentTask }}
 */
const useLmTask = (brain: AgentBrain) => {
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
    const read = (taskPath: string): AgentTask => {
        const { found, task } = readTask(taskPath);
        if (!found) {
            throw new Error(`Task ${taskPath} not found`)
        }
        //console.log("TASK", task);        
        const ts: AgentTaskSpec = {
            id: task.name,
            title: task.description,
            run: async (params: { prompt: string }) => {
                //let res: Record<string, any> = {};
                const expert = brain.getExpertForModel(task.model.name);
                if (!expert) {
                    return { error: `Expert for model ${task.model.name} not found` }
                }
                const ex = brain.expert(expert);
                if (ex.lm.providerType == "ollama") {
                    if (ex.lm.model.name != task.model.name) {
                        await ex.lm.loadModel(task.model.name);
                    }
                }
                const tpl = new PromptTemplate(task.template.name);
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
                if (task.shots.length > 0) {
                    task.shots.forEach((s) => tpl.addShot(s.user, s.assistant));
                }
                //const _p = task.prompt.replace("{prompt}", args[0]);
                tpl.replacePrompt(task.prompt)
                const pr = tpl.prompt(params.prompt);
                //console.log("PR", pr);
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
        read,
    }
}

export { useLmTask };
