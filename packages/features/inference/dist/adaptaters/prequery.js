import { parseTaskVars } from "@agent-smith/cli";

async function action(args, options) {
    //console.log("OPTS", options);
    const { vars } = parseTaskVars(args);
    let buf = [];
    args.forEach(arg => {
        if (!arg.includes("=")) {
            buf.push(arg);
        }
    });
    const res = { prompt: buf.join(" "), ...vars };
    return res;
}

export { action }