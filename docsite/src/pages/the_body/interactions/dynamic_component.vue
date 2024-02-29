<template>
    <div>
        <div class="prosed">
            <h1>Dynamic component</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>In this part we will map a dynamic component as the agent interaction widget. This way we can
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
            <div>Map this widget as the default interaction component in the agent component:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="ts"></static-code-block>
            </div>
            <div>
                Map the component to the actual agent state, by listening to the agent's state:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="ts"></static-code-block>
            </div>
            <div>Update the agent component template to use the dynamic component:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code5" lang="html"></static-code-block>
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

const code3 = `import { defineAsyncComponent } from "vue";

let AgentContent = defineAsyncComponent(() =>
    import('./widgets/AgentBaseText.vue')
);`;

const code4 = `import { defineAsyncComponent, onBeforeUnmount } from "vue";

const unbindListener = joe.state.listen((state, oldState, changed) => {
    if (changed == "component") {
        console.log("** component:", oldState.component, state.component)
        if (state.component != "") {
            let _comp = state.component;
            if (!state.component.endsWith(".vue")) {
                _comp = state.component + ".vue"
            }
            AgentContent = defineAsyncComponent(() =>
                import(/* @vite-ignore */ \`./widgets/\${_comp}\`)
            )
        }
    }
});

onBeforeUnmount(() => unbindListener())`;

const code5 = `<div v-if="joeState.isInteracting === true" class="bubble bubble-bottom-left mr-5 txt-light">
    <component :is="AgentContent"></component>
</div>`;
</script>