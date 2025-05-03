import { parseArgs } from "@agent-smith/cli";

async function action(_args) {
    const { conf, vars, args } = parseArgs(_args);
    const res = { prompt: args.join(" "), ...vars, ...conf };
    return res;
}

export { action }