import clipboard from 'clipboardy';
//import { execute } from "./execute.js";

//const { platform } = process;

async function readClipboard() {
    /*let res = "";
    if (platform == "linux") {
        res = await execute("xclip", ["-o", "-selection", "primary"]);
    } else {
        res = await clipboard.read();
    }
    return res*/
    return await clipboard.read();
}

async function writeToClipboard(data: string) {
    await clipboard.write(data);
}

/*import { platform } from "os";

async function getClipboard(): Promise<string> {
    const currentPlatform = platform();
    
    switch (currentPlatform) {
        case 'darwin': // macOS
            return await execute("pbpaste", []);
        case 'win32': // Windows
            return await execute("powershell", ["-command", "Get-Clipboard"]);
        case 'linux': // Linux
            return await execute("xclip", ["-o", "-selection", "clipboard"]);
        default:
            throw new Error(`Unsupported platform: ${currentPlatform}`);
    }
}*/

export {
    readClipboard,
    writeToClipboard,
}