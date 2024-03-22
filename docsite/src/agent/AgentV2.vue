<template>
    <div class="fixed bottom-12 right-8 flex flex-row items-end z-50">
        <template v-if="state.isVisible">
            <div v-if="state.isInteracting === true" class="bubble bubble-bottom-left mr-5 txt-light"
                v-html="state.text">
            </div>
            <robot-icon class="text-5xl cursor-pointer" :class="color" @click="agent.toggleInteract()"></robot-icon>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { agent, state } from "./agent";
import RobotIcon from "../widgets/RobotIcon.vue";

const color = computed(() => {
    let c = "txt-lighter";
    if (state.value.isInteracting) {
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