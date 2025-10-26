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
                if (!(name in taskInput)) {
                    const v = taskDef.variables.optional[name]?.default ?? "";
                    taskDef.prompt = taskDef.prompt.replaceAll(`{${name}}`, v);
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