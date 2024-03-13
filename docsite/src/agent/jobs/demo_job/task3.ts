import { AgentTask, useAgentTask } from "@agent-smith/jobs";

async function runTask(params: { data: string }): Promise<Record<string, any>> {
    console.log("Task 3 is running with input data:", params);
    // simulate 3 seconds of work
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log("Task 3 is finished");
    return { data: [0, 1, 2] }
}

const task3: AgentTask = useAgentTask({
    id: "task3",
    title: "Demo task 3",
    run: runTask,
});

export { task3 }