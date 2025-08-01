import { computed, reactive, ref } from "@vue/reactivity";
import { PythonShell } from 'python-shell';
import { InputMode, RunMode, FormatMode, OutputMode, VerbosityMode } from "../interfaces.js";
import { initDb } from "../db/db.js";
import { readFilePaths } from "../db/read.js";
import path from "path";
import { createDirectoryIfNotExists } from "../cmd/sys/dirs.js";

let pyShell: PythonShell;

const inputMode = ref<InputMode>("manual");
const outputMode = ref<OutputMode>("txt");
const runMode = ref<RunMode>("cmd");
const formatMode = ref<FormatMode>("text");
const isChatMode = ref(false);
//const verbosity = ref<VerbosityMode>("quiet");
const promptfilePath = ref("");
const dataDirPath = ref("");
const isStateReady = ref(false);

const lastCmd = reactive<{ name: string, args: Array<string> }>({
    name: "",
    args: [],
});

function initFilepaths() {
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
    initDb(false, false);
    initFilepaths();
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

/*function setVerbosity(mode: VerbosityMode) {
    verbosity.value = mode
}*/


export {
    inputMode,
    outputMode,
    isChatMode,
    runMode,
    formatMode,
    lastCmd,
    promptfilePath,
    dataDirPath,
    pluginDataDir,
    initState,
    initFilepaths,
    //setVerbosity,
    pyShell,
}