import { updateConfCmd } from "./cmd/clicmds/updateconf.js";
import { executeAction } from "./cmd/lib/actions/cmd.js";
import { McpClient } from "./cmd/lib/mcp.js";
import { parseCommandArgs } from "./cmd/lib/options_parsers.js";
import { executeTask } from "./cmd/lib/tasks/cmd.js";
import { readTask } from "./cmd/lib/tasks/read.js";
import { openTaskSpec } from "./cmd/lib/tasks/utils.js";
import { extractToolDoc } from "./cmd/lib/tools.js";
import { executeWorkflow } from "./cmd/lib/workflows/cmd.js";
import { readWorkflow } from "./cmd/lib/workflows/read.js";
import { allOptions, displayOptions, inferenceOptions, ioOptions } from "./cmd/options.js";
import { writeToClipboard } from "./cmd/sys/clipboard.js";
import { execute, run } from "./cmd/sys/execute.js";
import { readConf } from "./cmd/sys/read_conf.js";
import { createConfigFile, getConfigPath, processConfPath, updateConfigFile } from "./conf.js";
import { initDb } from "./db/db.js";
import { readBackends, readFeaturesType, readFilePaths, readTool } from "./db/read.js";
import { upsertTaskSettings } from "./db/write.js";
import { FeatureType, TaskSettings } from "./interfaces.js";
import { backend, setBackend } from "./state/backends.js";
import { init, initState, isStateReady, pluginDataDir } from "./state/state.js";
import { getTaskSettings } from "./state/tasks.js";
import { usePerfTimer } from "./utils/perf.js";
import { extractBetweenTags, splitThinking } from "./utils/text.js";

const db = {
    init: initDb,
    readFilePaths,
    readFeaturesType,
    readTool,
    getTaskSettings,
    upsertTaskSettings,
    readBackends,
};

const fs = {
    openTaskSpec,
    readWorkflow,
}

export {
    allOptions, backend, createConfigFile, db, displayOptions, execute, executeAction,
    executeTask, executeWorkflow, extractBetweenTags, extractToolDoc, FeatureType, fs, getConfigPath,
    inferenceOptions, init, initState, ioOptions, isStateReady, McpClient, openTaskSpec,
    parseCommandArgs, pluginDataDir, processConfPath, readConf, readTask, run, setBackend,
    splitThinking, TaskSettings, updateConfCmd,
    updateConfigFile, usePerfTimer, writeToClipboard,
};
