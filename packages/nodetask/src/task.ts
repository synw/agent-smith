import { Agent } from "@agent-smith/agent";
import { Task, TaskConf, TaskDef, TaskInput, TaskOutput } from "@agent-smith/task";
import { applyFilePlaceholders } from './files.js';

class NodeTask extends Task {

    constructor(agent: Agent, def: TaskDef) {
        super(agent, def)
    }

    async run(
        params: TaskInput, conf?: TaskConf
    ): Promise<TaskOutput> {
        this.def = applyFilePlaceholders(this.def, conf?.baseDir);
        return super.run(params, conf);
    }
}

export {
    NodeTask
};
