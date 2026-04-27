import { Agent } from "@agent-smith/agent";
import { Task } from "@agent-smith/task";
import type { TaskDef, AgentInferenceOptions, InferenceResult } from "@agent-smith/types";
import { applyFilePlaceholders } from './files.js';

class NodeTask extends Task {

    constructor(agent: Agent, def: TaskDef) {
        super(agent, def)
    }

    async run(
        params: { prompt: string } & Record<string, any>,
        conf?: AgentInferenceOptions
    ): Promise<InferenceResult> {
        this.def = applyFilePlaceholders(this.def);
        return super.run(params, conf);
    }
}

export {
    NodeTask
};
