import { reactive, ref } from "@vue/reactivity";
import { PythonShell } from 'python-shell';
import { InputMode, RunMode, FormatMode } from "../interfaces.js";
import { checkConf, confDir } from "../conf.js";
import { initDb, dbPopulateDefaults } from "../db/db.js";
import { readFeaturePaths } from "../db/read.js";
import { updateFeatures } from "../db/write.js";
import { readFeaturesDirs } from "./features.js";
import { readPluginsPaths } from "./plugins.js";

let pyShell: PythonShell;

const inputMode = ref<InputMode>("manual");
const runMode = ref<RunMode>("cmd");
const formatMode = ref<FormatMode>("markdown");
const promptfile = ref("");

const lastCmd = reactive<{ name: string, args: Array<string> }>({
    name: "",
    args: [],
});

function initConf() {
    const exists = checkConf();
    if (!exists) {
        console.log("Created configuration file in", confDir);
        initDb();
        dbPopulateDefaults();
        initConf();
    } else {
        initDb();
    }
}

async function initFeatures() {
    const fp = readFeaturePaths();
    const pp = await readPluginsPaths();
    const p = [...fp, ...pp];
    //console.log("STATE FPATHS", p);
    const feats = readFeaturesDirs(p);
    //console.log("STATE FEATS", feats);
    updateFeatures(feats);
}

async function initState() {
    initConf();
    await initFeatures()
    //console.log("State ready, available features:", readFeatures())
}

export {
    inputMode,
    runMode,
    formatMode,
    lastCmd,
    promptfile,
    initState,
    initFeatures,
    pyShell,
}