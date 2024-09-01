<template>
    <div v-html="agent.state.get().text"></div>
</template>

<script setup lang="ts">
import { AgentSmith } from '@agent-smith/body';

defineProps({
    agent: {
        type: Object as () => AgentSmith,
        required: true
    }
});
</script>