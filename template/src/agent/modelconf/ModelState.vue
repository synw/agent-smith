<template>
    <ModelStateIcon :is-connected="agent.brain.state.get().isOn"></ModelStateIcon>
</template>

<script setup lang="ts">
import ModelStateIcon from '../widgets/ModelStateIcon.vue';
import { agent } from '../agent';
</script>