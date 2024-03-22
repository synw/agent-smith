<template>
    <div>
        <vega-chart id="chart" v-if="Object.keys(data.chart).length > 0" :spec="toRaw(data.chart)"></vega-chart>
        <div v-else class="text-xl txt-light">No chart yet</div>
    </div>
</template>

<script setup lang="ts">
import { toRaw } from "vue";
import VegaChart from "@/widgets/VegaChart.vue";

defineProps({
    data: {
        type: Object as () => Record<string, any>,
        required: true,
    }
});
</script>