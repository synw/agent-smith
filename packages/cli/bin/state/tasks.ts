import { ref } from "@vue/reactivity";
import { readTaskSettings } from "../db/read.js";
import { TaskSettings } from "../interfaces.js";

const tasksSettings: Record<string, TaskSettings> = {};
const isTaskSettingsInitialized = ref(false);

function initTaskSettings() {
    const data = readTaskSettings();
    data.forEach(row => {
        const name = row.name;
        delete row.name;
        delete row.id;
        const vals: Record<string, any> = {};
        for (const [k, v] of Object.entries(row)) {
            if (v !== null) {
                vals[k] = v
            }
        }
        tasksSettings[name] = vals;
    });
    //console.log("TS", tasksSettings);
    isTaskSettingsInitialized.value = true;
}

export {
    tasksSettings,
    initTaskSettings,
    isTaskSettingsInitialized,
}