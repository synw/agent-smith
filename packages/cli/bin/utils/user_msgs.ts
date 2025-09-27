import { exit } from "process";
import colors from "ansi-colors";

function runtimeError(...msg: string[]) {
    console.warn("💥", colors.dim("Runtime error:"), ...msg);
    exit(1)
}

function runtimeWarning(...msg: string[]) {
    console.warn("⚠️", colors.dim("Runtime warning:"), ...msg);
    //exit(1)
}

function runtimeDataError(...msg: string[]) {
    console.warn("❌", colors.dim("Runtime data error:"), ...msg);
    exit(1)
}

function runtimeInfo(...msg: string[]) {
    //console.log("ℹ️ ", colors.dim("Info:"), ...msg);
    console.log("📫", colors.dim("Info:"), ...msg);
}

export {
    runtimeError,
    runtimeWarning,
    runtimeDataError,
    runtimeInfo,
}