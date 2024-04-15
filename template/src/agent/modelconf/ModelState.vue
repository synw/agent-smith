<template>
    <ModelStateIcon :is-connected="state.isOn"></ModelStateIcon>
</template>

<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import ModelStateIcon from '../widgets/ModelStateIcon.vue';
import { brain } from '../agent';

const state = useStore(brain.state);
</script>