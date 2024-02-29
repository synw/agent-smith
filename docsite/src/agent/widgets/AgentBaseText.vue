<template>
    <div v-html="joeState.text"></div>
</template>

<script setup lang="ts">
import { joeState } from "../agent";
</script>