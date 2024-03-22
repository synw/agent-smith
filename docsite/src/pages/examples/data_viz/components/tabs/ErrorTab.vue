<template>
    <div>
        <code>
        <pre>{{ data.error }}</pre>
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