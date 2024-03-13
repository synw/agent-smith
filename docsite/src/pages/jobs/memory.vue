<template>
    <div>
        <div class="prosed">
            <h1>Memory</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>The jobs can use a transient memory module to keep track of the tasks results
                in the Indexeddb database in the browser. Install the module:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="html"></static-code-block>
            </div>
            <div>To enable the memory for a job declare it like this:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="ts"></static-code-block>
            </div>
            <div>With the memory enabled the input <kbd>params</kbd> of a task and it's output
                <kbd>data</kbd> will be automatically saved after each task run. Let's create code to run the
                task 1 with some parameters, and then read the result from memory.
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="ts"></static-code-block>
            </div>
            <div>Note: the job <kbd>init</kbd> has been replaced by <kbd>syncMem</kbd>: this automatically
                synchronize the ephemeral state to the memory. In other words the data from previous task runs
                will be available in the state
            </div>
            <div class="flex flex-row space-x-3">
                <button class="btn light" @click="executeTask1()" :disabled="task1state.isRunning">Execute</button>
                <button class="btn light" @click="readTask1Mem()">Read
                    memory</button>
                <button class="btn light" @click="resetTask1()" :disabled="!task1state.isCompleted">Reset
                    task1 memory</button>
            </div>
            <div class="flex flex-col space-y-2">
                <div>Task 1 is running: <code>{{ task1state.isRunning }}</code></div>
                <div>Task 1 is completed: <code>{{ task1state.isCompleted }}</code></div>
                <div>Task 1 params: <code>{{ task1Result.params }}</code></div>
                <div>Task 1 data: <code>{{ task1Result.data }}</code></div>
            </div>
            <div>Execute the job, read the memory and then reload the page and read the memory again: the task 1 data
                will still be there after the first execution.
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="html"></static-code-block>
            </div>
            <div>This way the data of a previous task can be used as input for a given task. And
                the tasks can be rerun after a reload. This make it possible to create long running
                jobs and run only some tasks in it.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { hljs } from "@/conf";
import { StaticCodeBlock } from "@docdundee/vue";
import { onBeforeMount, reactive } from "vue";
import { TaskMem } from "@agent-smith/tmem-jobs";
import { jobs } from "@/agent/jobs/demo_job/index3";
import { useStore } from "@nanostores/vue";

const job = jobs[0];
// ui state
const task1state = useStore(job.tasks["task1"].state);
const task1Result = reactive<TaskMem>({
    params: {},
    data: {},
    isCompleted: false,
});

async function executeTask1() {
    await job.start();
    const params = { "param_task1": "task 1 param value" };
    await job.runTask("task1", params);
}

async function readTask1Mem() {
    // read from memory
    const res = await job.tmem.tasks.get<TaskMem>("task1");
    // map to ui
    task1Result.params = res.params;
    task1Result.data = res.data;
    task1Result.isCompleted = res.isCompleted;
}

async function resetTask1() {
    await job.tmem.tasks.set("task1", {
        params: {},
        data: {},
        isCompleted: false,
    });
    await readTask1Mem();
}

onBeforeMount(() => job.syncMem());

const code1 = `npm i @agent-smith/tmem-jobs`;

const code2 = `import { AgentJob, useAgentJob } from "@agent-smith/jobs";
import { useTmemJobs } from "@agent-smith/tmem-jobs";

const jobs: Array<AgentJob> = [
    useAgentJob({
        name: "demo_job",
        title: "A demo job",
        tasks: tasks,
        tmem: useTmemJobs(),
    }),
];`;

const code3 = `import { onBeforeMount, reactive } from "vue";
import { useStore } from "@nanostores/vue";
import { TaskMem } from "@agent-smith/tmem-jobs";
import { jobs } from "@/agent/jobs/demo_job/index3";

const job = jobs[0];
// ui state
const task1state = useStore(job.tasks["task1"].state);
const task1Result = reactive<TaskMem>({
    params: {},
    data: {},
    isCompleted: false,
});

async function executeTask1() {
    await job.start();
    const params = { "param_task1": "task 1 param value" };
    await job.runTask("task1", params);
}

async function readTask1Mem() {
    // read from memory
    const res = await job.tmem.tasks.get<TaskMem>("task1");
    // map to ui
    task1Result.params = res.params;
    task1Result.data = res.data;
    task1Result.isCompleted = res.isCompleted;
}

async function resetTask1() {
    await job.tmem.tasks.set("task1", {
        params: {},
        data: {},
        isCompleted: false,
    });
    await readTask1Mem();
}

onBeforeMount(() => job.syncMem());`;

const code4 = `<div class="flex flex-row space-x-3">
    <button class="btn light" @click="executeTask1()" :disabled="task1state.isRunning">Execute</button>
    <button class="btn light" @click="readTask1Mem()">Read
        memory</button>
    <button class="btn light" @click="resetTask1()" :disabled="!task1state.isCompleted">Reset
        task1 memory</button>
</div>
<div class="flex flex-col space-y-2">
    <div>Task 1 is running: <code>{{ task1state.isRunning }}</code></div>
    <div>Task 1 is completed: <code>{{ task1state.isCompleted }}</code></div>
    <div>Task 1 params: <code>{{ task1Result.params }}</code></div>
    <div>Task 1 data: <code>{{ task1Result.data }}</code></div>
</div>`;
</script>