<template>
    <div>
        <div class="prosed">
            <h1>Create a job</h1>
        </div>
        <div class="prosed">
            <h2>Define a job with tasks</h2>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>We will start by creating a simple task. Let's define an action function
                that will run when the task will be executed.
            </div>
            <div>Create an <kbd>agent/jobs/demojob</kbd>
                folder and a <kbd>task1.ts</kbd> file inside:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="ts"></static-code-block>
            </div>
            <div>The task can accept any input via the <kbd>params</kbd> and can output data. More details
                about how to manage data with tasks will be provided below.
            </div>
            <div>Let's create our job with
                the task in an <kbd>agent/jobs/jobs.ts</kbd> file:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="ts"></static-code-block>
            </div>
            <div class="prosed">
                <h2>Execute tasks</h2>
            </div>
            <div>
                To execute a task we need to start the job, and then run the task. A task
                takes input data and outputs some data:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="ts"></static-code-block>
            </div>
            <div>Example: open the console to see the output and run execute:</div>
            <div>
                <button class="btn light" @click="execute(1)">Execute</button>
            </div>
            <div class="prosed">
                <h2>Abort a task</h2>
            </div>
            <div>
                We will create a second task, simulating an infinite job. In a <kbd>task2.ts</kbd> file
                with an abort function:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="ts"></static-code-block>
            </div>
            <div>
                Let's map the abort function to a button:
            </div>
            <div class="flex flex-row space-x-3">
                <button class="btn light" @click="execute(2)">Execute</button>
                <button class="btn warning" @click="job.abortTask()">Abort</button>
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code5" lang="html"></static-code-block>
            </div>
        </div>
        <div class="pt-8">
            <a href="javascript:openLink('/jobs/config')">Next: config</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { hljs } from "@/conf";
import { useAgentJob, useAgentTask } from "@agent-smith/jobs";
//import { useAgentJob } from "../../../../packages/jobs/src/job";
//import { useAgentTask } from "../../../../packages/jobs/src/task";
import { StaticCodeBlock } from "@docdundee/vue";
import { jobs } from "../../agent/jobs/demo_job";

const job = jobs[0];

async function execute(n: number) {
    await job.start();
    const taskInputData = { some: "data" };
    const data = await job.runTask(`task${n}`, taskInputData);
    console.log(`Task ${n} returned data:`, data);
    await job.finish(true); // true is to flag the job as successful
}

const code1 = `import { useAgentTask } from "@agent-smith/jobs";

const runTask1 = async (params: any): Promise<Record<string, any>> => {
    console.log("Task 1 is running with input data:", params);
    // simulate 3 seconds of work
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log("Task 1 is finished");
    return { data: [0, 1, 2] }
};

const task1 = useAgentTask({
    id: "task1",
    title: "Test task 1",
    run: runTask1,
});

export { task1 }`;

const code2 = `import { AgentTask, AgentJob, useAgentJob } from "@agent-smith/jobs";
import { task1 } from "./task1";

const tasks: Array<AgentTask> = [task1];

const jobs: Array<AgentJob> = [
    useAgentJob({
        name: "demo_job",
        title: "A demo job",
        tasks: tasks
    }),
];

export { jobs }`;

const code3 = `async function execute() {
    await job.start();
    const taskInputData = { some: "data" };
    const data = await job.runTask("task1", taskInputData);
    console.log("Task 1 returned data:", data);
    await job.finish(true);
}`;

const code4 = `import { AgentTask, useAgentTask } from "@agent-smith/jobs";

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

export { task2 }`;

const code5 = `<button class="btn warning" @click="jobs[0].abortTask()">Abort</button>`;
</script>