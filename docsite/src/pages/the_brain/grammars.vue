<template>
    <div>
        <div class="prosed">
            <h1>Gbnf grammars</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>An expert can use gbnf grammars to constraint the output of the language model to a given format, if
                the model and backend support it. Note: Ollama does not support grammars.
                The grammars can be defined in Typescript intefaces with
                <a href="https://github.com/IntrinsicLabsAI/gbnfgen">Gbnfgen</a> or as raw strings.
            </div>
            <div class="prosed">
                <h2>Typescript grammars</h2>
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="ts"></static-code-block>
            </div>
            <div v-if="!hasExpert">
                <div class="text-lg font-medium">Configure an expert for the interactive demo:</div>
                <AgentConf class="p-3 mt-3 border rounded-md" @end="init()"></AgentConf>
            </div>
            <template v-else>
                <template v-if="state.status == 'ready'">
                    <Textarea class="w-[50rem] mt-3" v-model="q1" :rows="1" />
                    <div class="flex flex-row space-x-2">
                        <button class="btn semilight" @click="runQ1()" :disabled="state.isThinking">Run
                            the query</button>
                        <button v-if="state.isThinking" @click="brain.ex.abortThinking()">Abort</button>
                    </div>
                </template>
                <template v-else>expert not ready: {{ state.status }}</template>
            </template>
            <pre class="font-light" v-if="isReady"><code>{{ stream }}</code></pre>
            <div>The button click is mapped on this code:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="ts"></static-code-block>
            </div>
            <div class="prosed">
                <h2>Raw grammars</h2>
            </div>
            <div>Another option is to pass directly a gbnf grammar string in the options parameter. A
                simple yes/no grammar:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="ts"></static-code-block>
            </div>
            <div>Use the <kbd>grammar</kbd> option:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="ts"></static-code-block>
            </div>
            <div>Note about json: by default if a <kbd>grammar</kbd> or <kbd>tsgrammar</kbd> is provided the answer will
                be formated in json. Use the <kbd>parseJson</kbd> option to change this behavior.
            </div>
            <div class="pt-5">
                <a href="javascript:openLink('/the_brain/templates/basics')">Next: templates</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import Textarea from 'primevue/textarea';
import { StaticCodeBlock } from "@docdundee/vue";
import { hljs } from "@/conf";
import { brain } from "@/agent/agent";
import { discover } from './utils';
import { useStore } from '@nanostores/vue';
import AgentConf from "@/components/agentconf/AgentConf.vue";

let state: ReturnType<typeof useStore>;
let stream: ReturnType<typeof useStore>;
const hasExpert = ref(false);
const isReady = ref(false);

const q1 = ref("Write a list of the planets names of the solar system");
const grammar1 = `interface Grammar {
    planet_names: Array<string>;
}`;

async function init() {
    hasExpert.value = brain.experts.length > 0;
    if (hasExpert.value) {
        brain.ex.checkStatus();
        state = useStore(brain.ex.state);
        stream = useStore(brain.ex.backend.stream);
    }
    isReady.value = true
}

async function runQ1() {
    if (!brain.state.get().isOn) {
        await discover();
    }
    await brain.think(q1.value,
        {
            temperature: 0,
            min_p: 0.05,
            max_tokens: 500,
        },
        {
            tsGrammar: grammar1,
            verbose: true,
        })
}

const code1 = `const tsgrammar = \`interface Grammar {
    planet_names: Array<string>;
}\``;

const code2 = `async function runQ1() {
    if (!brain.state.get().isOn) {
        const found = await brain.discover();
        if (!found) {
            console.warn("Can not run query: the inference server is down")
            return
        }
    }
    await brain.think(q1.value, // the prompt
        {
            temperature: 0,
            min_p: 0.05,
            max_tokens: 500,
        },
        {
            tsGrammar: tsgrammar,
            verbose: true,
        })
}`;

const code3 = `const grammar = "root ::= (\\"yes\\" | \\"no\\")"`;

const code4 = `await brain.think("is the sky blue?"
    { temperature: 0 },
    { 
        grammar: grammar, 
        parseJson: false 
    },
)`;

onBeforeMount(() => init())
</script>