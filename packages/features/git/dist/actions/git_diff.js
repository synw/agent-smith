import { useAgentTask } from "@agent-smith/jobs";
import { execute } from "@agent-smith/cli";

const action = useAgentTask({
    id: "git_diff",
    title: "Git diff",
    run: async (args) => {
        //console.debug("git diff args:", args.join(" "));
        const diff = await execute("git", ["diff", ...args]);
        let msg = diff;
        const stagedDiff = await execute("git", ["diff", "--staged", ...args]);
        if (stagedDiff.length > 0) {
            msg += "\n" + stagedDiff
        }
        return { ok: true, data: { prompt: msg } }
    }
});

export { action }