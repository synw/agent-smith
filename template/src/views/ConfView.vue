<template>
    <div class="flex flex-col mb-8 space-y-3">
        <div class="prose">
            <h1>Server conf</h1>
        </div>
        <div>
            <AgentConf :brain="brain" :conf="conf"></AgentConf>
        </div>
    </div>
</template>

<script setup lang="ts">
import AgentConf from '@/agent/modelconf/AgentConf.vue';
import { brain, conf } from '@/agent/agent';
</script>