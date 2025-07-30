<template>
    <div>
        <div class="prosed">
            <h1>State management</h1>
        </div>
        <div class="prosed">
            <h2>Job and tasks UI state</h2>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>We will use a job with 3 simple tasks in this example to monitor the state of
                the job and tasks in the UI. We need to map the job and tasks state to be usable in
                the html template. In a component script:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="ts"></static-code-block>
            </div>
            <div>Now we can use the job and tasks state in the html template:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="html"></static-code-block>
            </div>
            <div class="flex flex-col space-y-1">
                <div>Job is running: <code>{{ jobState.isRunning }}</code></div>
                <div>Job is completed: <code>{{ jobState.isCompleted }}</code></div>
                <div>A task is running: <code>{{ jobState.isRunningTask }}</code></div>
                <div>
                    <div v-for="(task, i) in  Object.values(job.tasks) " class="flex flex-col space-y-3">
                        <div class="flex-row flex w-full items-center">
                            <div class="text-2xl mr-2">
                                <div class="warning w-2 h-2" v-if="tasksState[i].value.isRunning"></div>
                                <div class="success w-2 h-2" v-else-if="tasksState[i].value.isCompleted">
                                </div>
                                <div v-else class="semilight w-2 h-2"></div>
                            </div>
                            <div class="flex-grow">{{ task.title }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row space-x-3">
                <button class="btn light" @click="execute()">Execute</button>
            </div>
            <div class="prosed">
                <h2>Tasks with user interactions</h2>
            </div>
            <div>To run a task that must be triggered by a user interaction we need to use
                <kbd>startTask</kbd>. It marks the tasks as started but actually does not execute it. The
                execution is managed manualy after the user interaction with <kbd>continueTask</kbd>.
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="ts"></static-code-block>
            </div>
            <div class="flex flex-row space-x-2">
                <button class="btn light" @click="startTask1()" :disabled="tasksState[0].value.isRunning">Start
                    task1</button>
                <button v-if="showConfirmTask1" class="btn success" @click="confirmRunTask1()">Confirm run
                    task1</button>
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="html"></static-code-block>
            </div>
        </div>
        <div class="pt-8">
            <a href="javascript:openLink('/transient_memory/get_started')">Next: transient memory</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { hljs } from "@/conf";
import { StaticCodeBlock } from "@docdundee/vue";
import { Ref, onBeforeMount, ref } from "vue";
import { useStore } from "@nanostores/vue";
import { AgentTaskState } from "@agent-smith/jobs";
import { jobs } from "@/agent/jobs/demo_job/index2";

const job = jobs[0];
const jobState = useStore(job.state);
const tasksState = new Array<Ref<AgentTaskState>>();
const showConfirmTask1 = ref(false);

async function execute() {
    await job.start();
    await job.runTask("task1");
    await job.runTask("task3");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await job.runTask("task4");
    await job.finish(true); // true is to flag the job as successful
}

async function startTask1() {
    await job.start();
    await job.startTask("task1");
    showConfirmTask1.value = true;
}

async function confirmRunTask1() {
    showConfirmTask1.value = false;
    await job.continueTask();
    await job.finishTask(true);
}

async function init() {
    Object.values(job.tasks).forEach((t) => {
        const ts = useStore(t.state);
        tasksState.push(ts);
    })
}

onBeforeMount(() => init());

const code1 = `import { Ref, onBeforeMount } from "vue";
import { useStore } from "@nanostores/vue";
import { AgentTaskState } from "@agent-smith/jobs";
import { jobs } from "@/agent/jobs/demo_job/index2";

const job = jobs[0];
const jobState = useStore(job.state);
const tasksState = new Array<Ref<AgentTaskState>>();

async function execute() {
    await job.start();
    await job.runTask("task1");
    await job.runTask("task3");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await job.runTask("task4");
    await job.finish(true); // true is to flag the job as successful
}

async function init() {
    Object.values(job.tasks).forEach((t) => {
        const ts = useStore(t.state);
        tasksState.push(ts);
    })
}

onBeforeMount(() => init());`;

const code2 = `<div class="flex flex-col space-y-1">
    <div>Job is running: <code>{{ jobState.isRunning }}</code></div>
    <div>A task is running: <code>{{ jobState.isRunningTask }}</code></div>
    <div>
        <div v-for="(task, i) in  Object.values(job.tasks) " class="flex flex-col space-y-3">
            <div class="flex-row flex w-full items-center">
                <div class="text-2xl mr-2">
                    <div class="warning w-2 h-2" v-if="tasksState[i].value.isRunning"></div>
                    <div class="success w-2 h-2" v-else-if="tasksState[i].value.isCompleted">
                    </div>
                    <div v-else class="semilight w-2 h-2"></div>
                </div>
                <div class="flex-grow">{{ task.title }}</div>
            </div>
        </div>
    </div>
</div>
<div class="flex flex-row space-x-3">
    <button class="btn light" @click="execute()">Execute</button>
</div>`;

const code3 = `import { Ref, onBeforeMount, ref } from "vue";
import { jobs } from "@/agent/jobs/demo_job/index2";

const job = jobs[0];
const showConfirmTask1 = ref(false);

async function startTask1() {
    await job.start();
    await job.startTask("task1");
    showConfirmTask1.value = true;
}

async function confirmRunTask1() {
    showConfirmTask1.value = false;
    await job.continueTask();
    await job.finishTask(true);
}`;

const code4 = `<div class="flex flex-row space-x-2">
    <button class="btn light" @click="startTask1()" :disabled="tasksState[0].value.isRunning">Start
        task1</button>
    <button v-if="showConfirmTask1" class="btn success" @click="confirmRunTask1()">Confirm run
        task1</button>
</div>`;
</script>