<template>
    <div>
        <div class="prosed">
            <h1>The brain: basics</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>The brain module manages connections to inference servers. It is usable independently
                of the body. In this example we are going to use a local Koboldcpp server. </div>
            <div>Start a local Koboldcpp server with <a
                    href="https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF">Tinyllama
                    Chat</a> (1B)
                to run the interactive examples on this page. We are using a small model so that this example can run
                with
                a small memory and on CPU only.
            </div>
            <div>First let's declare our brain module with one expert:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="ts"></static-code-block>
            </div>
            <div>Note the <kbd>template</kbd> parameter. If you use another model change it accordingly.
                The templates are managed with the <a href="https://github.com/synw/modprompt">Modprompt</a>
                library that covers the most common formats.
            </div>
            <div>Let's ping our server to check if it's up:</div>
            <div>
                <button class="btn light" @click="discover()">Ping server</button>
            </div>
            <div>Server is up:
                <code :class="brainState.isOn ? 'txt-success' : 'txt-warning'">
                {{ brainState.isOn }}
                </code>
            </div>
            <div>The template part:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="html"></static-code-block>
            </div>
            <div>Now let's use the brain module and make a simple query:</div>
            <div>
                Query:<br />
                <Textarea class="w-[50rem] mt-3" v-model="q1" :rows="1" />
            </div>
            <div>
                <button class="btn semilight" @click="runQ1()" :disabled="!brainState.isOn">Run the
                    query</button>
            </div>
            <div v-if="runningQuery == 'q1' && isReady" v-html="brainStream.replaceAll('\n', '<br />')"
                class="font-light"></div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="html"></static-code-block>
            </div>
            <div>Here the <kbd>q1</kbd> variable is just a text ref. </div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="ts"></static-code-block>
            </div>
            <div class="prosed">
                <h2>Inference parameters</h2>
            </div>
            <div>
                The prompt above uses default server inference parameters. It is possible to
                configure the inference parameters for each prompt. Agent Smith uses the
                <a href="https://github.com/synw/locallm">LocalLm</a> library. See all the available
                inference params in the <a
                    href="https://synw.github.io/locallm/types/interfaces/InferenceParams.html">api
                    doc</a>.
                Example with a few params:
            </div>
            <div>
                <Textarea class="w-[50rem] mt-3" v-model="q2" :rows="2" />
            </div>
            <div>
                <button class="btn semilight" @click="runQ2()" :disabled="!brainState.isOn">Run
                    the query</button>
            </div>
            <div v-if="runningQuery == 'q2' && isReady">
                <pre class="font-light">{{ brainStream }}</pre>
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code5" lang="ts"></static-code-block>
            </div>
            <div class="prosed">
                <h2>Observability</h2>
            </div>
            <div>The template used and the exact final prompt sent to the language model can be inspected. The template
                in json:</div>
            <div>
                <static-code-block :hljs="hljs" :code="JSON.stringify(brain.ex.template.toJson())"
                    lang="ts"></static-code-block>
            </div>
            <div>We use the brain current expert <kbd>ex</kbd>'s template object. Code:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code6" lang="ts"></static-code-block>
            </div>
            <div>The template in plain text:</div>
            <div>
                <static-code-block :hljs="hljs" :code="brain.ex.template.render()" lang="html"></static-code-block>
            </div>
            <div>Code:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code7" lang="ts"></static-code-block>
            </div>
            <div>The final prompt</div>
            <div>
                <static-code-block :hljs="hljs" :code="brain.ex.template.prompt(q2)" lang="html"></static-code-block>
            </div>
            <div>Code:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code8" lang="ts"></static-code-block>
            </div>
            <AgentWidget></AgentWidget>
            <div>Check the <a href="https://github.com/synw/modprompt">Modprompt</a> library for more details.</div>
            <div class="pt-5">
                <a href="javascript:openLink('/the_brain/options')">Next: options</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import Textarea from 'primevue/textarea';
import { StaticCodeBlock } from "@docdundee/vue";
import { hljs } from "@/conf";
import { brain, agent } from "@/agent/agent";
import { initLm } from '@/agent/state';
import AgentWidget from '@/agent/AgentWidget.vue';
import { discover } from './utils';
import { useStore } from '@nanostores/vue';

let brainStream = useStore(brain.stream);
let brainState = useStore(brain.state);
const isReady = ref(false);

const runningQuery = ref<"q1" | "q2">("q1");
const q1 = ref("Write a short list of the planets names of the solar system");
const q2 = ref("Write a short list of the planets names of the solar system. Important: return only the list in a markdown block");

async function runQ2() {
    runningQuery.value = "q2";
    await brain.think(q2.value, {
        temperature: 0,
        min_p: 0.05,
        max_tokens: 200,
    }, { verbose: true })
}

async function runQ1() {
    runningQuery.value = "q1";
    await brain.think(q1.value, {
        temperature: 0,
        min_p: 0.05,
        max_tokens: 200,
    }, { verbose: true })
}

async function init() {
    agent.state.setKey("component", "AgentBaseText");
    if (!brain.state.get().isOn) {
        await initLm()
    }
    brainStream = useStore(brain.ex.stream);
    isReady.value = true
}

const code1 = `import { useStore } from '@nanostores/vue';
import { useLmExpert, useAgentBrain } from "@agent-smith/brain";

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "zephyr",
});
// map the brain to the body (optional)
const agent = useAgentSmith({
    name: "Joe",
    jobs: jobs,
    modules: [brainModule],
});

const brainModule = useAgentBrain([expert]);
const brain = brainModule.brain;
// this one is to get reactive variables in the ui template
const brainState = useStore(brain.state);`;

const code2 = `<div>
    <button class="btn light" @click="brain.discover()">Ping server</button>
</div>
<div>Server is up:
    <code :class="brainState.isOn ? 'txt-success' : 'txt-warning'">
        {{ brainState.isOn }}
    </code>
</div>`;

const code3 = `<div>
    Query:<br />
    <Textarea class="w-[50rem] mt-3" v-model="q1" :rows="1" />
</div>
<div>
    <button class="btn light" 
        @click="brain.think(q1)" 
        :disabled="!brainState.isOn">
        Run the query
    </button>
</div>
<div v-html="brainStream.replaceAll('\\n', '<br />')"></div>`;

const code4 = `const q1 = ref("Write a short list of the planets names of the solar system");`;

const code5 = `async function runQuery() {
    await brain.think(q2.value, {
        temperature: 0,
        min_p: 0.05,
        max_tokens: 200,
    })
}`;

const code6 = `brain.ex.template.toJson()`;

const code7 = `brain.ex.template.render()`;

const code8 = `brain.ex.template.prompt("Write a short list of...")`;

onBeforeMount(() => {
    init()
})
</script>