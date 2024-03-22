<template>
    <div>
        <div class="prosed">
            <h1>Basic Agent</h1>
            <p>The body of Agent Smith can interact with the user. Note: we use Vuejs and Tailwindcss
                for the UI code examples.
            </p>
            <p>
                <span class="text-bold">Note:</span> the interactivity bindings are managed with
                <a href="https://github.com/nanostores/nanostores">Nanostores</a>. Install the
                <a href="https://github.com/nanostores/nanostores?tab=readme-ov-file#integration">integration</a>
                for your framework, here we will use <a href="https://github.com/nanostores/vue">@nanostores/vue</a>
                for the examples below.
            </p>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <p>Let's create a basic agent in a <kbd>agent/agent.ts</kbd> file:</p>
            <static-code-block :hljs="hljs" :code="code1" lang="ts"></static-code-block>
            <div>The <kbd>state</kbd> variable will be used to manage the UI interactivity.
                Now give let's our agent a body in a <kbd>agent/AgentWidget.vue</kbd> file. In the script part:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="ts"></static-code-block>
            </div>
            <div>In the template part:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="html"></static-code-block>
            </div>
            <div class="prose">
                <h2>Interactions</h2>
                <h3>Show / hide</h3>
            </div>
            <div>
                <button class="btn light" @click="state.isVisible ? agent.hide() : agent.show();">Toggle agent</button>
                <div class="mt-3">Agent is visible: <code>{{ state.isVisible }}</code></div>
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="html"></static-code-block>
            </div>
        </div>
        <AgentWidget></AgentWidget>
        <div class="pt-5">
            <a href="javascript:openLink('/the_body/interactions/talk')">Next: the talk interaction</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { StaticCodeBlock } from "@docdundee/vue";
import { hljs } from "@/conf";
import { agent, state } from "@/agent/agent";
import AgentWidget from "@/agent/AgentWidget.vue";


const code1 = `import { useAgentSmith } from "@agent-smith/body";
import { useStore } from '@nanostores/vue'

const agent = useAgentSmith({ name: "Agent" });
const state = useStore(agent.state);

export { agent, state }`;

const code2 = `import { agent } from "./agent";
import RobotIcon from "../widgets/RobotIcon.vue";` // your icon here

const code3 = `<template>
    <div class="fixed bottom-12 right-8 z-50">
        <template v-if="state.isVisible">
            <robot-icon class="text-5xl cursor-pointer"></robot-icon>
        </template>
    </div>
</template>`;

const code4 = `<button class="btn light" @click="state.isVisible ? agent.hide() : agent.show();">
    Toggle Joe
</button>
<div class="mt-3">
    Joe is visible: <code>{{ state.isVisible }}</code>
</div>`;
</script>