<template>
  <dispatch-route :hljs="hljs" :nav="nav" :url="$route.path" :on-open="$router.push"
    :base-title="libTitle"></dispatch-route>
</template>

<script setup lang="ts">
import { DispatchRoute } from '@docdundee/vue';
import { nav } from '@/state';
import { hljs, libTitle } from "@/conf";
</script>