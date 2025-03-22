import { execute } from "@agent-smith/cli";

async function action(args) {
    const nextArgs = {};
    const currentArgs = [];
    for (const arg of args) {
        if (arg.includes("=")) {
            const sp = arg.split("=");
            nextArgs[sp[0]] = sp[1];
        } else {
            currentArgs.push(arg)
        }
    }
    const data = await execute("cat", currentArgs);
    return { prompt: data, ...nextArgs }
}

export { action }