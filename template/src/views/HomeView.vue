<template>
  <div class="flex flex-col mb-8 space-y-3">
    <div class="prose">
      <h1>Server conf</h1>
    </div>
    <div>
      <ModelConf></ModelConf>
    </div>
    <AgentSmith></AgentSmith>
  </div>
</template>

<script setup lang="ts">
import AgentSmith from '@/agent/AgentSmith.vue';
import ModelConf from '@/agent/widgets/ModelConf.vue';
</script>