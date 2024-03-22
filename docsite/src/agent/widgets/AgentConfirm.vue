<template>
    <div class="flex flex-col">
        <div v-html="state.text"></div>
        <div class="flex flex-row mt-3 space-x-2 text-sm">
            <button class="btn warning" @click="declineAction()">No</button>
            <button class="btn success" @click="confirmAction()">Yes</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { agent, state } from "../agent";

function declineAction() {
    agent.interactions.get().decline()
}

function confirmAction() {
    agent.interactions.get().confirm()
}
</script>