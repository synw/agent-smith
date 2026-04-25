import { Agent } from "@agent-smith/agent";
import { Task } from "@agent-smith/task";
import { TaskDef, TaskInput, type AgentInferenceOptions, type InferenceResult } from "@agent-smith/types";
import { applyFilePlaceholders } from './files.js';

class NodeTask extends Task {

    constructor(agent: Agent, def: TaskDef) {
        super(agent, def)
    }

    async run(
        params: TaskInput, conf?: AgentInferenceOptions
    ): Promise<InferenceResult> {
        this.def = applyFilePlaceholders(this.def);
        return super.run(params, conf);
    }
}

export {
    NodeTask
};
