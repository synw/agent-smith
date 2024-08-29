import { Cmd } from "../../interfaces.js";
import { formatMode, inputMode, outputMode, runMode } from "../../state/state.js";

const modes: Record<string, Cmd> = {
    "-if": {
        cmd: async () => {
            inputMode.value = "promptfile";
            if (runMode.value == "cli") { console.log("Prompt file input mode is on") }
        },
        description: "use promptfile input mode",
    },
    "-ic": {
        cmd: async () => {
            inputMode.value = "clipboard";
            if (runMode.value == "cli") { console.log("Clipboard input mode is on") }
        },
        description: "use clipboard input mode"
    },
    "-im": {
        cmd: async () => {
            inputMode.value = "manual";
            if (runMode.value == "cli") { console.log("Manual inputMode") }
        },
        description: "use manual input mode (default)"
    },
    "-oc": {
        cmd: async () => {
            outputMode.value = "clipboard";
            if (runMode.value == "cli") { console.log("Clipboard output mode is on") }
        },
        description: "use clipboard output mode"
    },
    "-omd": {
        cmd: async () => {
            formatMode.value = "markdown";
            if (runMode.value == "cli") { console.log("Markdown output mode") }
        },
        description: "use markdown output"
    },
    "-otxt": {
        cmd: async () => {
            formatMode.value = "text";
            if (runMode.value == "cli") { console.log("Text output mode (default)") }
        },
        description: "use text output "
    },
};

export { modes }