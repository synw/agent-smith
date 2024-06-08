import clipboard from 'clipboardy';
import { execute } from "./execute.js";

const { platform } = process;

async function readClipboard() {
    let res = "";
    if (platform == "linux") {
        res = await execute("xclip", ["-o", "-selection", "primary"]);
    } else {
        res = await clipboard.read();
    }
    return res
}

async function writeToClipboard(data: string) {
    await clipboard.write(data);
}

export {
    readClipboard,
    writeToClipboard,
}