import { FeatureType } from "../../../interfaces.js";
import { useAgentTask, AgentTask } from "@agent-smith/jobs";

function createJsAction(action: CallableFunction): AgentTask<FeatureType, any, any> {
    const task = useAgentTask<FeatureType, any, any>({
        id: "",
        title: "",
        run: async (args) => {
            try {
                const res = await action(args);
                return res
            }
            catch (e) {
                throw new Error(`executing action:${e}`);
            }
        }
    });
    return task
}

export { createJsAction }