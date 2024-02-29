<template>
    <div class="flex flex-col">
        <div v-html="joeState.text"></div>
        <div class="flex flex-row mt-3 space-x-2 text-sm">
            <button class="btn warning" @click="declineAction()">No</button>
            <button class="btn danger" @click="confirmAction()">Cancel</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { joe, joeState } from "../agent";

const declineAction = () => joe.interactions.get().decline();
const confirmAction = () => joe.interactions.get().confirm();
</script>