import { reactive, ref } from "@vue/reactivity";
import { PythonShell } from 'python-shell';
import { InputMode, RunMode, FormatMode, OutputMode } from "../interfaces.js";
import { createConfDirIfNotExists, confDir } from "../conf.js";
import { initDb } from "../db/db.js";
import { readFeaturePaths, readFilePaths } from "../db/read.js";
import { updateAliases, updateFeatures } from "../db/write.js";
import { readFeaturesDirs } from "./features.js";
import { readPluginsPaths } from "./plugins.js";
import path from "path";
import { createDirectoryIfNotExists } from "../cmd/sys/dirs.js";
import { updateModels } from "../cmd/lib/models.js";

let pyShell: PythonShell;

const inputMode = ref<InputMode>("manual");
const outputMode = ref<OutputMode>("txt");
const runMode = ref<RunMode>("cmd");
const formatMode = ref<FormatMode>("text");
const isChatMode = ref(false);
const isDebug = ref(false);
const isVerbose = ref(false);
const isShowTokens = ref(false);
const promptfilePath = ref("");
const dataDirPath = ref("");
const isStateReady = ref(false);

const lastCmd = reactive<{ name: string, args: Array<string> }>({
    name: "",
    args: [],
});

function initConf() {
    const exists = createConfDirIfNotExists();
    if (!exists) {
        console.log("Created configuration directory", confDir);
    }
    //console.log("INIT DB");
    initDb();
    //console.log("END INIT DB");
}

async function initFeatures() {
    //console.log("INIT FEATURES");
    const fp = readFeaturePaths();
    const pp = await readPluginsPaths();
    const p = [...fp, ...pp];
    //console.log("STATE FPATHS", p);
    const feats = readFeaturesDirs(p);
    //console.log("STATE FEATS", feats);
    updateFeatures(feats);
    updateAliases(feats);
    updateModels();
    //promptfilePath.value = readPromptFilePath();
    const filePaths = readFilePaths();
    //console.log("FP", filePaths);
    for (const fp of filePaths) {
        switch (fp.name) {
            case "promptfile":
                promptfilePath.value = fp.path
                break;
            case "datadir":
                dataDirPath.value = fp.path
        }
    }
}

async function initState() {
    if (isStateReady.value) {
        return
    }
    //sconsole.log("INIT STATE");
    initConf();
    await initFeatures();
    isStateReady.value = true;
    //console.log("State ready, available features:", readFeatures())
}

function _getDataDirPath() {
    if (dataDirPath.value.length == 0) {
        throw new Error("datadir path is not configured: update your config file with 'datadir' and run conf")
    }
    return dataDirPath.value
}


function pluginDataDir(pluginName: string): string {
    const dd = _getDataDirPath();
    const pluginDatapath = path.join(dd, pluginName);
    createDirectoryIfNotExists(pluginDatapath);
    return pluginDatapath
}


export {
    inputMode,
    outputMode,
    isChatMode,
    isShowTokens,
    runMode,
    formatMode,
    lastCmd,
    isDebug,
    isVerbose,
    promptfilePath,
    dataDirPath,
    pluginDataDir,
    initState,
    initFeatures,
    pyShell,
}