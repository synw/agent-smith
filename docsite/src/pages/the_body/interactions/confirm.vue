<template>
    <div>
        <div class="prosed">
            <h1>The confirm interaction</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>Let's use the confirm interaction. We will start by creating a confirm widget
                in <kbd>agent/widgets/AgentConfirm.vue</kbd>: the template part:
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
                <static-code-block :hljs="hljs" :code="code5" lang="html"></static-code-block>
            </div>
            <div>Let's prepare the confirm action:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="ts"></static-code-block>
            </div>
            <div>Note that the component to use is passed in the options. Now map the confirm action on the agent's
                click interaction:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="ts"></static-code-block>
            </div>
        </div>
        <AgentV3></AgentV3>
        <div class="pt-5">
            <a href="javascript:openLink('/the_brain/overview')">Next: the brain: overview</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { hljs } from "@/conf";
import { StaticCodeBlock } from "@docdundee/vue";
import AgentV3 from '@/agent/AgentV3.vue';
import { agent } from '@/agent/agent';

const confirmAction = async () => {
    alert("action is confirmed");
    agent.mute();
};

const declineAction = async () => {
    console.log("action is declined");
    agent.mute();
};

const options = {
    component: "AgentConfirm",
    onDecline: declineAction,
};

const setConfirmAction = () => {
    agent.confirm("Do you confirm this action?",
        confirmAction,
        options,
    )
};

const code1 = `<div class="flex flex-col">
    <div v-html="state.text"></div>
    <div class="flex flex-row mt-3 space-x-2 text-sm">
        <button class="btn warning" @click="declineAction()">No</button>
        <button class="btn success" @click="confirmAction()">Yes</button>
    </div>
</div>`;

const code2 = `import { agent, state } from "../agent";

async function declineAction() {
    agent.interactions.get().decline()
}

async function confirmAction() {
    agent.interactions.get().confirm()
}`;

const code3 = `import { agent } from '@/agent/agent';

const confirmAction = async () => {
    alert("action is confirmed");
    agent.mute();
};

const declineAction = async () => {
    console.log("action is declined");
    agent.mute();
};

const options = {
    component: "AgentConfirm",
    onDecline: declineAction,
};

const setConfirmAction = () => {
    agent.confirm("Do you confirm this action?",
        confirmAction,
        options,
    )
};`;

const code4 = `import { onMounted } from "vue";

onMounted(() => {
    agent.show();
    agent.interactions.setKey("click", setConfirmAction);
})`;

const code5 = `<div v-if="state.isInteracting === true" class="bubble bubble-bottom-left mr-5 txt-light">
    <agent-base-text v-if="state.component == 'AgentBaseText'"></agent-base-text>
    <agent-confirm v-else-if="state.component == 'AgentConfirm'"></agent-confirm>
</div>`;

onMounted(() => {
    agent.show();
    agent.interactions.setKey("click", setConfirmAction);
})
</script>