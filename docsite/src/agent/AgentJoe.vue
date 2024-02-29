<template>
    <div class="fixed bottom-12 right-8 z-50">
        <template v-if="joeState.isVisible">
            <robot-icon class="text-5xl cursor-pointer"></robot-icon>
        </template>
    </div>
</template>

<script setup lang="ts">
import { joeState } from "./agent";
import RobotIcon from "../widgets/RobotIcon.vue";
</script>