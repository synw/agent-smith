import { TaskDef, TaskInput } from "./interfaces.js";

function applyVariables(taskDef: TaskDef, taskInput: TaskInput): TaskDef {
    // check taskDef variables
    if (taskDef?.variables) {
        if (taskDef.variables?.required) {
            for (const [name, def] of Object.entries(taskDef.variables.required)) {
                if (!(name in taskInput)) {
                    throw new Error(`The variable ${name} is required to run this taskDef`)
                }
            }
        }
        if (taskDef.variables?.optional) {
            for (const [name, def] of Object.entries(taskDef.variables.optional)) {
                if (!(name in taskInput)) {
                    taskDef.prompt = taskDef.prompt.replaceAll(`{${name}}`, "");
                }
            }
        }
    }
    // apply variables
    for (const [k, v] of Object.entries(taskInput)) {
        taskDef.prompt = taskDef.prompt.replaceAll(`{${k}}`, v);
    }
    return taskDef;
}

export {
    applyVariables,
}