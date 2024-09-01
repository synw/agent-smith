<template>
    <div class="flex flex-col">
        <div v-html="agent.state.get().text"></div>
        <div class="flex flex-row mt-3 space-x-2 text-sm">
            <button class="btn warning" @click="declineAction()">No</button>
            <button class="btn success" @click="confirmAction()">Yes</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AgentSmith } from '@agent-smith/body';

const props = defineProps({
    agent: {
        type: Object as () => AgentSmith,
        required: true
    }
});

function declineAction() {
    props.agent.interactions.get().decline()
}

function confirmAction() {
    props.agent.interactions.get().confirm()
}
</script>