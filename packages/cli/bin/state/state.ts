import { reactive, ref } from "@vue/reactivity";
import { PythonShell } from 'python-shell';
import { InputMode, RunMode, FormatMode, OutputMode } from "../interfaces.js";
import { createConfDirIfNotExists, confDir } from "../conf.js";
import { initDb } from "../db/db.js";
import { readFeaturePaths } from "../db/read.js";
import { updateAliases, updateFeatures } from "../db/write.js";
import { readFeaturesDirs } from "./features.js";
import { readPluginsPaths } from "./plugins.js";

let pyShell: PythonShell;

const inputMode = ref<InputMode>("manual");
const outputMode = ref<OutputMode>("txt");
const runMode = ref<RunMode>("cmd");
const formatMode = ref<FormatMode>("text");
const promptfile = ref("");

const lastCmd = reactive<{ name: string, args: Array<string> }>({
    name: "",
    args: [],
});

function initConf() {
    const exists = createConfDirIfNotExists();
    if (!exists) {
        console.log("Created configuration directory", confDir);
    }
    initDb();
}

async function initFeatures() {
    const fp = readFeaturePaths();
    const pp = await readPluginsPaths();
    const p = [...fp, ...pp];
    //console.log("STATE FPATHS", p);
    const feats = readFeaturesDirs(p);
    //console.log("STATE FEATS", feats);
    updateFeatures(feats);
    updateAliases(feats);
}

async function initState() {
    initConf();
    await initFeatures()
    //console.log("State ready, available features:", readFeatures())
}

export {
    inputMode,
    outputMode,
    runMode,
    formatMode,
    lastCmd,
    promptfile,
    initState,
    initFeatures,
    pyShell,
}