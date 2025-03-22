import { execute } from "@agent-smith/cli";

async function action(args) {
    const nextArgs = {};
    const currentArgs = [];
    for (const arg of args) {
        if (arg.includes("=")) {
            if (arg.startsWith("ext=")) {
                const el = arg.split("=")[1].split(",");
                el.forEach((a) => {
                    currentArgs.push("-e");
                    currentArgs.push(a);
                });
            } else {
                const sp = arg.split("=");
                nextArgs[sp[0]] = sp[1];
            }
        } else {
            currentArgs.push(arg)
        }
    }
    //console.log("CA", currentArgs);
    //console.log("NA", nextArgs);
    const data = await execute("files-to-prompt", currentArgs);
    console.log("DATA LEN", data.length);
    return { ok: true, data: { prompt: data, ...nextArgs } }
}

export { action }