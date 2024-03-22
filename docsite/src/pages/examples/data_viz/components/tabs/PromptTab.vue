<template>
    <div>
        <code>
        <pre>{{ data.finalPrompt }}</pre>
    </code>
    </div>
</template>

<script setup lang="ts">
defineProps({
    data: {
        type: Object as () => Record<string, any>,
        required: true,
    }
});
</script>