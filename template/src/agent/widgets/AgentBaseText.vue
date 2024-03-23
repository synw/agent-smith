<template>
    <div v-html="state.text"></div>
</template>

<script setup lang="ts">
import { state } from "../agent";
</script>