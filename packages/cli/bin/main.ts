import { execute, run } from "./cmd/sys/execute.js";
import { executeTask } from "./cmd/lib/tasks/cmd.js";
import { executeAction } from "./cmd/lib/actions/cmd.js";
import { executeWorkflow } from "./cmd/lib/workflows/cmd.js";
import { writeToClipboard } from "./cmd/sys/clipboard.js";
import { initState, pluginDataDir, init, isStateReady } from "./state/state.js";
import { usePerfTimer } from "./utils/perf.js";
import { parseCommandArgs } from "./cmd/lib/options_parsers.js";
import { extractToolDoc } from "./cmd/lib/tools.js";
import { openTaskSpec } from "./cmd/lib/tasks/utils.js";
import { extractBetweenTags, splitThinking } from "./utils/text.js";
import { displayOptions, ioOptions, inferenceOptions, allOptions } from "./cmd/options.js";
import { McpClient } from "./cmd/lib/mcp.js";
import { readTask } from "./cmd/lib/tasks/read.js";
import { FeatureType, TaskSettings } from "./interfaces.js";
import { getConfigPath } from "./conf.js";
import { readFeaturesType, readFilePaths } from "./db/read.js";
import { readConf } from "./cmd/sys/read_conf.js";
import { backend } from "./state/backends.js";
import { getTaskSettings } from "./state/tasks.js";
import { upsertTaskSettings } from "./db/write.js";

const db = {
    readFilePaths,
    readFeaturesType,
    getTaskSettings,
    upsertTaskSettings,
};

const fs = {
    openTaskSpec,
}

export {
    execute,
    run,
    executeTask,
    executeAction,
    executeWorkflow,
    writeToClipboard,
    initState,
    init,
    pluginDataDir,
    usePerfTimer,
    parseCommandArgs,
    extractToolDoc,
    openTaskSpec,
    extractBetweenTags,
    splitThinking,
    displayOptions,
    ioOptions,
    inferenceOptions,
    allOptions,
    isStateReady,
    backend,
    McpClient,
    readTask,
    FeatureType,
    getConfigPath,
    readConf,
    TaskSettings,
    db,
    fs,
}