import { AgentTask, useAgentTask } from "@agent-smith/jobs";

let timerId = 0;
let end: (boolean) => void = (boolean) => null;

async function runTask(): Promise<Record<string, any>> {
    // simulate an infinite task
    const promise = new Promise((resolve) => {
        end = resolve;
        let i = 1;
        timerId = setInterval(() => {
            console.log(i, "- running task 2");
            ++i
        }, 1000);
    });
    await promise;
    return { ok: true }
}

async function abortTask() {
    console.log("Aborting task 2");
    clearInterval(timerId);
    end(false);
}

const task2: AgentTask = useAgentTask({
    id: "task2",
    title: "Demo task 2",
    run: runTask,
    abort: abortTask,
});

export { task2 }

