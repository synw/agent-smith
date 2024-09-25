<template>
    <div>
        <div class="prosed">
            <h1>History management</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>Let's add some history turns:</div>
            <div class="txt-light">
                <pre>{{ ex.template.render() }}</pre>
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="ts"></static-code-block>
            </div>
            <div class="prose">
                <h2>Usage</h2>
            </div>
            <div>To record the history turns use this:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="ts"></static-code-block>
            </div>
            <div>Read the history:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="ts"></static-code-block>
            </div>
            <div class="pt-5">
                <a href="javascript:openLink('/the_brain/templates/few_shots')">Next: few shots</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { StaticCodeBlock } from "@docdundee/vue";
import { hljs } from "@/conf";
import { onBeforeMount } from "vue";
import { HistoryTurn } from "modprompt";
import { useLmBackend, useLmExpert } from "@agent-smith/brain";

const ex = useLmExpert({
    name: "demo",
    backend: useLmBackend({ name: "browser", localLm: "browser" }),
    template: "chatml",
    model: { name: "dummy", ctx: 2048 },
});

function addTurns() {
    const turns: Array<HistoryTurn> = [
        {
            user: "Hello",
            assistant: "Hi, what can I do for you?"
        },
        {
            user: "What is your name",
            assistant: "I am AI assistant xyz"
        },
    ];
    turns.forEach((t) => ex.template.pushToHistory(t))
}

const code2 = `import { HistoryTurn } from "modprompt";

const turns: Array<HistoryTurn> = [
    {
        user: "Hello",
        assistant: "Hi, what can I do for you?"
    },
    {
        user: "What is your name",
        assistant: "I am AI assistant xyz"
    },
];
turns.forEach((t) => ex.template.pushToHistory(t));
const finalTemplate = ex.template.render();`;

const code3 = `const _prompt = "What is your name?"
const res = await ex.think(_prompt);
ex.pushToHistory({user: _prompt, assistant: res.text});`;

const code4 = `const history: Array<HistoryTurn> = ex.template.history;`;

onBeforeMount(() => {
    addTurns();
})
</script>