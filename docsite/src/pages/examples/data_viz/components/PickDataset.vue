<template>
    <div class="flex flex-col">
        <div class="flex flex-wrap gap-3">
            <div v-for="dataset in Object.keys(datasets)" class="border bord-lighter rounded-md p-2 flex items-center">
                <button class="btn w-64" @click="pickDataset(dataset)">
                    {{ dataset }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
import { datasets } from "../datasets";

const emit = defineEmits(["end"]);

/*const datasets = ref(new Map());
const showDatasets = `from vega_datasets.core import _load_dataset_info

_load_dataset_info()`;

async function init() {
    const { results, error } = await py.run(showDatasets);
    //console.log(results, error)
    datasets.value = results;
}*/

function pickDataset(name: string) {
    emit("end", name);
}

//onBeforeMount(() => init())
</script>