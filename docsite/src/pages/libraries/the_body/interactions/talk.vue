<template>
    <div>
        <div class="prosed">
            <h1>The talk interaction</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>
                Let's give our agent the hability to talk. Let's create a bubble widget: add
                this css in a <kbd>&lt;style&gt;</kbd> block to the agent component:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="css"></static-code-block>
            </div>
            <div>Modify to component to add the css and map the current <kbd>state.text</kbd>
                (a reactive variable) to the component content, and <kbd>state.toggleInteract</kbd>
                to the click action of the component:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="html"></static-code-block>
            </div>
            <div>Now our agent can talk:</div>
            <div>
                <button class="btn light" @click="agent.talk('Hi, I am Joe, your demo agent', 3)">Talk</button>
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="html"></static-code-block>
            </div>
            <div>
                The second parameter of <kbd>agent.talk</kbd> is the number of seconds it is talking. The duration is
                optional: it will stay forever by default. Now let's map a ui behavior: the agent will change color when
                talking.
                Add this to the script part:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="ts"></static-code-block>
            </div>
            <div>
                Modify the agent icon to map the css class on the computed property:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code5" lang="html"></static-code-block>
            </div>
            <div>
                Finally we are going to map the talk action to the click on the agent icon:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code6" lang="ts"></static-code-block>
            </div>
        </div>
        <AgentV2></AgentV2>
        <div class="mt-8">
            <a href="javascript:openLink('/the_body/interactions/components')">Next:
                map components on the agent interactions
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { hljs } from "@/conf";
import { StaticCodeBlock } from "@docdundee/vue";
import AgentV2 from '@/agent/AgentV2.vue';
import { agent } from '@/agent/agent';

const code1 = `.bubble {
    z-index: 20;
    position: relative;
    max-width: 30em;
    background-color: #fff;
    padding: 1.125em 1.5em;
    border-radius: 1rem;
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, .3), 0 0.0625rem 0.125rem rgba(0, 0, 0, .2);
}

.bubble-bottom-left:before {
    z-index: 30;
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left: 98%;
    bottom: 25%;
    rotate: 90deg;
    border: .75rem solid transparent;
    border-top: none;
    border-bottom-color: #fff;
    filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, .1));
}`;

const code2 = `<div class="fixed bottom-12 right-8 flex flex-row items-end z-50">
    <template v-if="state.isVisible">
        <div v-if="state.isInteracting === true" 
            class="bubble bubble-bottom-left mr-5 txt-light"
            v-html="state.text">
        </div>
        <robot-icon class="text-5xl cursor-pointer" @click="agent.toggleInteract()"></robot-icon>
    </template>
</div>`;

const code3 = `<button class="btn light" @click="agent.talk('Hi, I am your demo agent', 3)">Talk</button>`;

const code4 = `import { computed } from "vue";

const color = computed(() => {
    let c = "txt-lighter";
    if (state.value.isInteracting) {
        c = "txt-light"
    }
    return c
});`;

const code5 = `<robot-icon class="text-5xl cursor-pointer" 
    :class="color" @click="agent.toggleInteract()"></robot-icon>`;

const code6 = `import { onBeforeMount } from 'vue';

onBeforeMount(() => {
    agent.show();
    agent.interactions.setKey(
        "click",
        () => agent.talk('Hi, I am your demo agent', 3)
    );
})`;

onBeforeMount(() => {
    agent.show();
    agent.interactions.setKey(
        "click",
        () => agent.talk('Hi, I am your demo agent', 3)
    );
})
</script>
