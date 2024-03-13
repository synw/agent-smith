import { AgentTask, AgentJob, useAgentJob } from "@agent-smith/jobs";
import { task1 } from "./task1";
import { task2 } from "./task2";

const tasks: Array<AgentTask> = [task1, task2];

const jobs: Array<AgentJob> = [
    useAgentJob({
        name: "demo_job",
        title: "A demo job",
        tasks: tasks
    }),
];

export { jobs }