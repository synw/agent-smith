<template>
    <div class="fixed bottom-12 right-8 flex flex-row items-end z-50">
        <template v-if="agent.state.get().isVisible">
            <div v-if="agent.state.get().isInteracting === true" class="bubble bubble-bottom-left mr-5 txt-light">
                <agent-base-text v-if="agent.state.get().component == 'AgentBaseText'" :agent="agent"></agent-base-text>
                <agent-confirm v-else-if="agent.state.get().component == 'AgentConfirm'" :agent="agent"></agent-confirm>
                <agent-confirm-cancel v-else-if="agent.state.get().component == 'AgentConfirmCancel'"
                    :agent="agent"></agent-confirm-cancel>
            </div>
            <robot-icon class="text-5xl cursor-pointer" :class="color" @click="agent.toggleInteract()"></robot-icon>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { agent } from "./agent";
import RobotIcon from "../widgets/RobotIcon.vue";
import AgentBaseText from "./widgets/AgentBaseText.vue";
import AgentConfirm from "./widgets/AgentConfirm.vue";
import AgentConfirmCancel from "./widgets/AgentConfirmCancel.vue";

const color = computed(() => {
    let c = "txt-lighter";
    if (agent.state.get().isInteracting) {
        c = "txt-light"
    }
    return c
});
</script>

<style>
.bubble {
    z-index: 20;
    position: relative;
    max-width: 30em;
    background-color: #fff;
    padding: 1.125em 1.5em;
    border-radius: 1rem;
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, .3), 0 0.0625rem 0.125rem rgba(0, 0, 0, .2);
}

.bubble-bottom-left:before {
    z-index: 30;
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left: 98%;
    bottom: 25%;
    rotate: 90deg;
    border: .75rem solid transparent;
    border-top: none;
    border-bottom-color: #fff;
    filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, .1));
}
</style>