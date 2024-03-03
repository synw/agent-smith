<template>
    <div>
        <div class="prosed">
            <h1>Few shots prompts</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>Adding a few shots to the prompt often helps to improve the quality of the output. It
                works the same as history, except that shots come first.
            </div>
            <div>Let's create a few shot prompt (using the Alpaca template):</div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="ts"></static-code-block>
            </div>
            <div>The template rendering:</div>
            <div class="txt-light">
                <pre>{{ joe.brain.ex.template.render() }}</pre>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { StaticCodeBlock } from "@docdundee/vue";
import { hljs } from "@/conf";
import { joe } from "@/agent/agent4";
import { TurnBlock } from "modprompt";
import { onBeforeMount } from "vue";

function createPrompt() {
    const shots: Array<TurnBlock> = [
        {
            user: "The movie was incredibly entertaining and I laughed a lot",
            assistant: "positive",
        },
        {
            user: "The service at the restaurant was unbearably slow",
            assistant: "negative",
        },
        {
            user: "The weather today is neither hot nor cold, it's just right",
            assistant: "neutral",
        },
    ];
    shots.forEach((s) => joe.brain.ex.template.addShot(s.user, s.assistant));
}

const code1 = `import { TurnBlock } from "modprompt";

const shots: Array<TurnBlock> = [
    {
        user: "The movie was incredibly entertaining and I laughed a lot",
        assistant: "positive",
    },
    {
        user: "The service at the restaurant was unbearably slow",
        assistant: "negative",
    },
    {
        user: "The weather today is neither hot nor cold, it's just right",
        assistant: "neutral",
    },
];
shots.forEach((s) => joe.brain.ex.template.addShot(s.user, s.assistant));`;

onBeforeMount(() => createPrompt())
</script>