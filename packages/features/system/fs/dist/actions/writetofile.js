import fs from 'fs';
import path from 'path';


async function action(args) {
    let isVerbose = false;
    let passPrompt = false;

    if (args.length < 2) {
        throw new Error("Provide both a content string and a file path");
    }

    for (const arg of args.slice(2)) {
        if (arg === "-v") {
            isVerbose = true;
        }
        if (arg === "-p") {
            passPrompt = true;
        }
    }

    const content = args[0];
    const filePath = args[1];

    // Ensure the directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        throw new Error(`The directory ${dirPath} does not exist`);
    }

    // Write content to file
    fs.writeFileSync(filePath, content);
    if (isVerbose) {
        console.log(`File ${filePath} written`);
    }
    if (passPrompt) {
        data = { prompt: content };
    }

    return filePath + " written";
}

export { action };