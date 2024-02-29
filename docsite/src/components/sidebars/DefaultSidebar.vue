<template>
  <auto-nav-children :node="nav.tree" class="space-y-1 nav-panel" :on-open="$router.push"></auto-nav-children>
</template>

<script setup lang="ts">
import { nav } from "@/state";
import { AutoNavChildren } from "@docdundee/vue";
</script>