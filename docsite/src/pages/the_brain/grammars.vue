<template>
    <div>
        <div class="prosed">
            <h1>Gbnf grammars</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>An expert can use gbnf grammars to constraint the output of the language model to a given format.
                The grammars can be defined in Typescript intefaces with
                <a href="https://github.com/IntrinsicLabsAI/gbnfgen">Gbnfgen</a> or as raw strings.
            </div>
            <div class="prosed">
                <h2>Typescript grammars</h2>
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="ts"></static-code-block>
            </div>
            <div>
                Query:<br />
                <Textarea class="w-[50rem] mt-3" v-model="q1" :rows="1" disabled />
            </div>
            <div>
                <button class="btn semilight" @click="runQ1()">Run the query</button>
            </div>
            <pre class="font-light"><code>{{ brainStream }}</code></pre>
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
                <a href="javascript:openLink('/the_brain/multiple_experts')">Next: multiple experts</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Textarea from 'primevue/textarea';
import { StaticCodeBlock } from "@docdundee/vue";
import { hljs } from "@/conf";
import { brain, brainStream } from "@/agent/agent";

const q1 = ref("Write a list of the planets names of the solar system");
const grammar1 = `interface Grammar {
    planet_names: Array<string>;
}`;

async function runQ1() {
    if (!brain.state.get().isOn) {
        const found = await brain.discover();
        if (!found) {
            console.warn("Can not run query: the inference server is down")
            return
        }
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
)`
</script>