import { Cmd } from "../../interfaces.js";
import { formatMode, inputMode, isChatMode, isDebug, isShowTokens, isVerbose, outputMode, runMode, setVerbosity } from "../../state/state.js";

const modes: Record<string, Cmd> = {
    "-d": {
        cmd: async () => {
            setVerbosity("debug");
            if (runMode.value == "cli") { console.log("Debug mode is on") }
        },
        description: "use debug mode",
    },
    "-t": {
        cmd: async () => {
            isShowTokens.value = !isShowTokens.value;
            if (runMode.value == "cli") { console.log("Show tokens mode is", isShowTokens.value ? "on" : "off") }
        },
        description: "use verbose mode",
    },
    "-v": {
        cmd: async () => {
            setVerbosity("verbose");;
            if (runMode.value == "cli") { console.log("Verbose mode is", isVerbose.value ? "on" : "off") }
        },
        description: "use verbose mode",
    },
    "-c": {
        cmd: async () => {
            isChatMode.value = !isChatMode.value;
            if (runMode.value == "cli") { console.log("Chat mode is", isChatMode.value ? "on" : "off") }
        },
        description: "use chat mode for tasks",
    },
    "--if": {
        cmd: async () => {
            inputMode.value = "promptfile";
            if (runMode.value == "cli") { console.log("Prompt file input mode is on") }
        },
        description: "use promptfile input mode",
    },
    "--ic": {
        cmd: async () => {
            inputMode.value = "clipboard";
            if (runMode.value == "cli") { console.log("Clipboard input mode is on") }
        },
        description: "use clipboard input mode"
    },
    "--im": {
        cmd: async () => {
            inputMode.value = "manual";
            if (runMode.value == "cli") { console.log("Manual inputMode") }
        },
        description: "use manual input mode (default)"
    },
    "--oc": {
        cmd: async () => {
            outputMode.value = "clipboard";
            if (runMode.value == "cli") { console.log("Clipboard output mode is on") }
        },
        description: "use clipboard output mode"
    },
    "--omd": {
        cmd: async () => {
            formatMode.value = "markdown";
            if (runMode.value == "cli") { console.log("Markdown output mode") }
        },
        description: "use markdown output"
    },
    "--otxt": {
        cmd: async () => {
            formatMode.value = "text";
            if (runMode.value == "cli") { console.log("Text output mode (default)") }
        },
        description: "use text output "
    },
};

export { modes }