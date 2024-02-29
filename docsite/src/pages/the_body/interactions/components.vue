<template>
    <div>
        <div class="prosed">
            <h1>Components</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>In this part we will map componentq as the agent interaction widget. This way we can
                use different widgets for our interactions.<br /><br />
                Let's start by setting a dynamic
                interaction subcomponent in the agent component, instead of using just text.
                First let's create a basic <kbd>agent/widgets/AgentText.vue</kbd>: the template
                part:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="html"></static-code-block>
            </div>
            <div>The script part:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="ts"></static-code-block>
            </div>
            <div>In the agent code map the component to the state:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="html"></static-code-block>
            </div>
        </div>
        <AgentJoeV3></AgentJoeV3>
        <div class="mt-8">
            <a href="javascript:openLink('/the_body/interactions/confirm')">Next: the confirm
                interaction</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { hljs } from "@/conf";
import { StaticCodeBlock } from "@docdundee/vue";
import AgentJoeV3 from '@/agent/AgentJoeV3.vue';

const code1 = `<div v-html="joeState.text"></div>`;

const code2 = `import { joeState } from "../agent";`;

const code3 = `<div v-if="joeState.isInteracting === true" class="bubble bubble-bottom-left mr-5 txt-light">
    <agent-base-text v-if="joeState.component == 'AgentBaseText'"></agent-base-text>
</div>`;
</script>