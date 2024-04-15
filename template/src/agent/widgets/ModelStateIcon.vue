<template>
    <span>
        <span class="icon-[mdi--security-network]" v-if="!isConnected"></span>
        <span class="icon-[mdi--wide-area-network]" v-else></span>
    </span>
</template>

<script setup lang="ts">
defineProps({
    isConnected: {
        type: Boolean,
        required: true,
    }
});
</script>