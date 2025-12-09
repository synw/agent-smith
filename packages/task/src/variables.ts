import { HistoryTurn } from "@locallm/types/dist/history.js";
import { TaskDef, TaskInput } from "./interfaces.js";

function applyVariables(taskDef: TaskDef, taskInput: TaskInput): TaskDef {
    //console.log("\n--------TD", typeof taskDef, Object.keys(taskDef))
    // check taskDef variables
    if (taskDef?.variables) {
        if (taskDef.variables?.required) {
            for (const name of Object.keys(taskDef.variables.required)) {
                if (!(name in taskInput)) {
                    throw new Error(`The variable ${name} is required to run this taskDef`)
                }
            }
        }
        if (taskDef.variables?.optional) {
            for (const name of Object.keys(taskDef.variables.optional)) {
                // cleanup unused optional variables
                if (!(name in taskInput)) {
                    const v = taskDef.variables.optional[name]?.default ?? "";
                    taskDef.prompt = taskDef.prompt.replaceAll(`{${name}}`, v);
                    if (taskDef.template?.system) {
                        taskDef.template.system = taskDef.template.system.replaceAll(`{${name}}`, v);
                    }
                    if (taskDef?.shots) {
                        const nshots = new Array<HistoryTurn>();
                        taskDef.shots.forEach(s => {
                            let nshot = s;
                            if (s?.user) {
                                nshot.user = s.user.replaceAll(`{${name}}`, v);
                            }
                            nshots.push(nshot)
                        })
                        taskDef.shots = nshots;
                    }
                }
            }
        }
    }
    // apply variables
    for (const [k, v] of Object.entries(taskInput)) {
        taskDef.prompt = taskDef.prompt.replaceAll(`{${k}}`, v);
        if (taskDef.template?.system) {
            taskDef.template.system = taskDef.template.system.replaceAll(`{${k}}`, v);
        }
        if (taskDef?.shots) {
            const nshots = new Array<HistoryTurn>();
            taskDef.shots.forEach(s => {
                let nshot = s;
                if (s?.user) {
                    nshot.user = s.user.replaceAll(`{${k}}`, v);
                }
                nshots.push(nshot)
            })
            taskDef.shots = nshots;
        }
    }
    return taskDef;
}

export {
    applyVariables,
}