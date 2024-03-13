import { AgentTask, AgentJob, useAgentJob } from "@agent-smith/jobs";
import { useTmemJobs } from "@agent-smith/tmem-jobs";
import { task1 } from "./task1";
import { task3 } from "./task3";
import { task4 } from "./task4";

const tasks: Array<AgentTask> = [task1, task3, task4];

const jobs: Array<AgentJob> = [
    useAgentJob({
        name: "demo_job",
        title: "A demo job",
        tasks: tasks,
        tmem: useTmemJobs(),
    }),
];

export { jobs }