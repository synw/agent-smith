import { useAgentTask } from "@agent-smith/jobs";
import fs from 'fs';
import path from 'path';

const action = useAgentTask({
    id: "writetofile",
    title: "Save content to a file",
    run: async (args) => {
        //console.log("ARGS", args);
        const isVerbose = false;
        const passPrompt = false;
        if (args.length < 1) {
            throw new Error("Provide a content string");
        }
        if (args.length < 2) {
            throw new Error("Provide a file path");
        }
        if (args.length > 2) {
            for (const arg of args) {
                if (arg == "-v") {
                    isVerbose = true
                }
                if (arg == "-p") {
                    passPrompt = true
                }
            }

        }
        const content = args[0];
        const filePath = args[1];
        // Ensure the directory exists
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            throw new Error(`The directory ${dirPath} does not exist`)
        }
        // Write content to file
        fs.writeFileSync(filePath, content);
        if (isVerbose) {
            console.log(`File ${filePath} created`)
        }
        const data = { ok: true };
        if (passPrompt) {
            data["data"] = { prompt: content }
        }
        return data;
    }
});

export { action }