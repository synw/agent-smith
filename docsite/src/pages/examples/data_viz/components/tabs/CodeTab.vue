<template>
    <div>
        <RenderMd v-if="data['finalCode'].length > 0" :hljs="hljs" :source="data['finalCode']"></RenderMd>
        <!-- code v-if="data['finalCode'].length > 0">
            <pre>{{ data.finalCode }}</pre>
        </code -->
        <code v-else>
            <pre>{{ brainStream }}</pre>
        </code>
    </div>
</template>

<script setup lang="ts">
import { brain } from "@/agent/agent";
import { RenderMd } from "@docdundee/vue";
import { hljs } from "@/conf";
import { useStore } from "@nanostores/vue";

const brainStream = useStore(brain.ex.stream);

defineProps({
    data: {
        type: Object as () => Record<string, any>,
        required: true,
    }
})
</script>