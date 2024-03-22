<template>
    <div>
        <div class="prosed">
            <h1>History management</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>The history of a conversation can be handled in templates. Let's create an expert
                with an Alpaca template:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="ts"></static-code-block>
            </div>
            <div>Let's add some history turns:</div>
            <div class="txt-light">
                <pre>{{ expert.template.render() }}</pre>
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
            <div class="pt-5">
                <a href="javascript:openLink('/the_brain/templates/few_shots')">Next: few shots</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { StaticCodeBlock } from "@docdundee/vue";
import { hljs } from "@/conf";
import { expert } from "@/agent/agent4";
import { onBeforeMount } from "vue";
import { HistoryTurn } from "modprompt";

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
    turns.forEach((t) => expert.template.pushToHistory(t))
}

const code1 = `import { useLmExpert } from "@agent-smith/brain";

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "alpaca",
});

export { expert }`;

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
turns.forEach((t) => expert.template.pushToHistory(t));
const finalTemplate = expert.template.render();`;

const code3 = `const _prompt = "What is your name?"
const res = await expert.think(_prompt);
expert.pushToHistory({user: _prompt, assistant: res.text});`

onBeforeMount(() => {
    addTurns();
})
</script>