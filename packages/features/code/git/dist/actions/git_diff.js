import { execute } from "@agent-smith/cli";

async function action(args) {
    const gitParams = [];
    const nextParams = {};
    for (const arg of args) {
        if (!arg.includes("=")) {
            gitParams.push(arg)
        } else {
            const sp = arg.split("=");
            nextParams[sp[0]] = sp[1];
        }
    }
    //console.log("************ git diff", ...gitParams)
    const diff = await execute("git", ["diff", ...gitParams]);
    let msg = diff;
    const stagedDiff = await execute("git", ["diff", "--staged", ...gitParams]);
    if (stagedDiff.length > 0) {
        msg += "\n" + stagedDiff
    }
    //console.log("Next params:", nextParams);
    const res = { prompt: msg, ...nextParams };
    //console.log("GIT DIFF RES", res)
    return res
}

export { action }