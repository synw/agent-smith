<template>
    <div class="flex flex-col space-y-2">
        <div>Using in browser inference with model Qwen 2.5 0.5b q5k_m (file size: 420M).
        </div>
        <div>The model has to be downloaded
            only once: it will live in the browser cache.</div>
        <div v-if="isDownloading" class="pt-2">
            <ProgressBar :value="loadingProgress"></ProgressBar>
        </div>
        <div v-else class="pt-2">
            <button class="btn warning" @click="downloadModel()">Download the model</button>
        </div>
        <div class="pt-2">
            <button class="btn txt-light" @click="isDownloading ? router.go(0) : emit('cancel')">Cancel</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { brain } from '@/agent/agent';
import { BrowserModelConf, LmExpertConfDef } from '@/interfaces';
import { WllamaProvider } from '@locallm/browser';
import { OnLoadProgress } from '@locallm/types';
import { onBeforeMount, ref } from 'vue';
import ProgressBar from 'primevue/progressbar';
import { useRouter } from 'vue-router';

const emit = defineEmits(["end", "cancel"]);

const isDownloading = ref(false);
const router = useRouter();
const loadingProgress = ref(0);
const model: BrowserModelConf = {
    name: "qween-0.5b",
    slug: "Qwen2.5-0.5B-Instruct-Q5_K_M",
    url: "https://huggingface.co/bartowski/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/Qwen2.5-0.5B-Instruct-Q5_K_M.gguf",
    ctx: 32768,
    template: "chatml",
    info: {
        size: "0.5b",
        quant: "q5k_m"
    },
    isDownloaded: false,
};
const bc = brain.backend("browser");

const _onModelLoading: OnLoadProgress = (st) => {
    //console.log(st.percent, "%");
    loadingProgress.value = st.percent;
    /*if (loadingProgress.value == 100) {
        state.value = "load";
    }*/
}

async function downloadModel() {
    isDownloading.value = true;
    // @ts-ignore
    await bc.lm.wllama.exit();
    bc.lm = WllamaProvider.init({ name: bc.name, onToken: bc.lm.onToken });
    //bc.lm.wllama.cacheManager.clear();
    //console.log("Loadmodel");
    loadingProgress.value = 0;
    await bc.lm.loadModel(
        model.name,
        model.ctx,
        model.url,
        _onModelLoading,
    );
    await bc.probe();
    const exDef: LmExpertConfDef = {
        modelName: model.name,
        modelCtx: model.ctx,
        templateName: model.template,
    };
    isDownloading.value = false;
    emit("end", exDef)
}

async function init() {
    await bc.lm.modelsInfo();
    //console.log("Models", bc.lm.models.map((x) => x.name));
    let isModelDownloaded = bc.lm.models.map((x) => x.name).includes(model.slug);
    if (isModelDownloaded) {
        // auto load model
        await downloadModel()
    }
}

onBeforeMount(() => init())
</script>