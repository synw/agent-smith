<template>
    <div>
        <div v-if="step == 1">
            <div class="prosed">
                <h2>Pick a dataset</h2>
            </div>
            <BlockUI :blocked="blocked">
                <pick-dataset @end="showDataset($event)" class="mb-8"></pick-dataset>
            </BlockUI>
        </div>
        <div v-if="step < 2">
            <div class="prosed">
                <h2>Model conf</h2>
            </div>
            <model-conf class="mt-8"></model-conf>
            <div class="mt-5">
                Recommended models: Deepseek 1.3b, 6.7b or 33b (note: the version 1.5 - 7b is not recommended)
            </div>
        </div>
        <div v-else-if="step == 2">
            <view-dataset :dataset="datasetName" @pick="step = 1"></view-dataset>
        </div>
    </div>
</template>

<script setup lang="ts">
import { initPy } from "@/py";
import { onBeforeMount, ref } from "vue";
import "vuepython/style.css";
import BlockUI from 'primevue/blockui';
import PickDataset from "./data_viz/components/PickDataset.vue";
import ViewDataset from "./data_viz/components/ViewDataset.vue";
import ModelConf from "../../agent/widgets/ModelConf.vue";

const step = ref(1);
const datasetName = ref("");
const blocked = ref(true);

async function init() {
    await initPy();
    blocked.value = false
}

function showDataset(name: string) {
    //console.log("DS", name)
    datasetName.value = name;
    step.value = 2;
}

onBeforeMount(() => init())
</script>