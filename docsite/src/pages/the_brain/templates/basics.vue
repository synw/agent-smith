<template>
    <div>
        <div class="prosed">
            <h1>Templates</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>The templates are managed with the <a href="https://github.com/synw/modprompt">Modprompt</a>
                library. Create an expert with a ChatMl template:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="ts"></static-code-block>
            </div>
            <div>Let's see what the template looks like:</div>
            <div class="txt-light" v-if="step == 1">
                <pre>{{ brain.ex.template.render() }}</pre>
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="html"></static-code-block>
            </div>
            <div class="prose">
                <h2>System</h2>
            </div>
            <div>Let's add a system message:</div>
            <div>
                <button class="btn light" @click="addSystemMsg()">Add system message</button>
            </div>
            <div>The template:</div>
            <div class="txt-light" v-if="step == 2">
                <pre>{{ brain.ex.template.render() }}</pre>
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="ts"></static-code-block>
            </div>
            <div class="prose">
                <h2>Prompt</h2>
            </div>
            <div>To modify the prompt:</div>
            <div>
                <button class="btn light" @click="modifyPompt()">Modify the prompt</button>
            </div>
            <div>The template:</div>
            <div class="txt-light" v-if="step == 3">
                <pre>{{ brain.ex.template.render() }}</pre>
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="ts"></static-code-block>
            </div>
            <div>To render the template with a prompt:</div>
            <div>
                <button class="btn light" @click="renderTemplate()">Render the template</button>
            </div>
            <div>The template:</div>
            <div class="txt-light" v-if="step == 4">
                <pre>{{ brain.ex.template.prompt("{a: 1,}") }}</pre>
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code5" lang="html"></static-code-block>
            </div>
            <div class="pt-5">
                <a href="javascript:openLink('/the_brain/templates/history')">Next: history</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { StaticCodeBlock } from "@docdundee/vue";
import { hljs } from "@/conf";
import { brain } from "@/agent/agent3";
import { ref } from "vue";

const step = ref<1 | 2 | 3 | 4>(1);

const code1 = `import { useAgentSmith } from "@agent-smith/body";
import { useLmExpert, useAgentBrain } from "@agent-smith/brain";

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "chatml",
});
const brain = useAgentBrain([expert]);

export { brain }`;

const code2 = `<div class="text-light">
    <pre>{{ brain.ex.template.render() }}</pre>
</div>`;

const code3 = `function addSystemMsg() {
    brain.ex.template.replaceSystem("You are a javascript AI code assistant")
}`;

const code4 = `function modifyPompt() {
    brain.ex.template.replacePrompt("fix this invalid json:\n\n\`\`\`json\n{prompt}\n\`\`\`")
}`;

const code5 = `{{ brain.ex.template.prompt("{a: 1,}") }}`;

function addSystemMsg() {
    console.log("TPL", brain.ex.template.name);
    brain.ex.template.replaceSystem("You are a javascript AI code assistant");
    step.value = 2;
}

function modifyPompt() {
    brain.ex.template.replacePrompt("fix this invalid json:\n\n```json\n{prompt}\n```");
    step.value = 3;
}

function renderTemplate() {
    step.value = 4;
}
</script>