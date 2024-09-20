import { useAgentTask } from "@agent-smith/jobs";
import { execute } from "@agent-smith/cli";

const action = useAgentTask({
    id: "git_diff",
    title: "Git diff",
    run: async (args) => {
        //console.debug("git diff args:", args);
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
        //console.log("git diff", ...gitParams)
        const diff = await execute("git", ["diff", ...gitParams]);
        let msg = diff;
        const stagedDiff = await execute("git", ["diff", "--staged", ...gitParams]);
        if (stagedDiff.length > 0) {
            msg += "\n" + stagedDiff
        }
        //console.log("Next params:", nextParams);
        return { ok: true, data: { prompt: msg, ...nextParams } }
    }
});

export { action }