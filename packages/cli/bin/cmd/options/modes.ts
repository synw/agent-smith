import { Cmd } from "../../interfaces.js";
import { formatMode, inputMode, runMode } from "../../state/state.js";

const modes: Record<string, Cmd> = {
    "-f": {
        cmd: async () => {
            inputMode.value = "promptfile";
            if (runMode.value == "cli") { console.log("Prompt file inputMode on") }
        },
        description: "use promptfile inputMode",
    },
    "-c": {
        cmd: async () => {
            inputMode.value = "clipboard";
            if (runMode.value == "cli") { console.log("Clipboard inputMode on") }
        },
        description: "use clipboard inputMode"
    },
    "-m": {
        cmd: async () => {
            inputMode.value = "manual";
            if (runMode.value == "cli") { console.log("Manual inputMode") }
        },
        description: "use manual inputMode (default)"
    },
    "-md": {
        cmd: async () => {
            formatMode.value = "markdown";
            if (runMode.value == "cli") { console.log("Markdown output mode") }
        },
        description: "use manual markdown output (default)"
    },
    "-txt": {
        cmd: async () => {
            formatMode.value = "text";
            if (runMode.value == "cli") { console.log("Text output mode") }
        },
        description: "use manual text output "
    },
};

export { modes }