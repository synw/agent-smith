import { useAgentTask } from "@agent-smith/jobs";
import { execute } from "@agent-smith/cli";

const action = useAgentTask({
    id: "read_file",
    title: "Read file",
    run: async (args) => {
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
        return { ok: true, data: { prompt: data, ...nextArgs } }
    }
});

export { action }