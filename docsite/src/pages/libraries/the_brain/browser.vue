<template>
    <div>
        <div class="prosed">
            <h1>In browser inference</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>Run inference queries locally in the browser. It uses <a
                    href="https://github.com/ngxson/wllama">Wllama</a>
                to run Llama.cpp in the browser. It supports only cpu inference for now.</div>
            <div class="prosed">
                <h2>Initialize</h2>
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="ts"></static-code-block>
            </div>
            <div class="prosed">
                <h2>Load a model</h2>
            </div>
            <div>Let's load the Smollm 360m instruct model from HuggingFace:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="ts"></static-code-block>
            </div>
            <div>The model will be downloaded once and placed in the cache for later local load. Important: the
                model files must not exceed 512 megabytes to be able to stay in the cache. For models bigger than 512M
                split the gguf files using Llama.cpp (ref: <a
                    href="https://github.com/ngxson/wllama?tab=readme-ov-file#split-model">Wllama doc</a>)
            </div>
            <div>
                <button class="btn light" @click="loadModel()" :disabled="isModelLoaded">Load model</button>
            </div>
            <div v-if="!isModelLoaded">
                <ProgressBar :value="loadingProgress"></ProgressBar>
            </div>
            <div>Is model loaded: {{ isModelLoaded }}</div>
            <div class="prosed">
                <h2>Run an inference query</h2>
            </div>
            <div>
                <Textarea class="w-[50rem] mt-3" v-model="q" :rows="1" />
            </div>
            <div class="flex flex-row space-x-3">
                <button class="btn" :class="isModelLoaded ? 'success' : 'light'" @click="infer()"
                    :disabled="(!isModelLoaded || isRunningInference)">Run inference</button>
                <button v-if="isRunningInference" class="btn danger" @click="ex.abortThinking()">Abort</button>
            </div>
            <div>{{ output }}</div>
            <div class="pt-5">
                <a href="javascript:openLink('/the_brain/jobs')">Next: jobs</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { hljs } from "@/conf";
import { StaticCodeBlock } from "@docdundee/vue";
import Textarea from 'primevue/textarea';
import { OnLoadProgress } from "@locallm/types";
import ProgressBar from 'primevue/progressbar';
import { ref } from "vue";
import { PromptTemplate } from "modprompt";
import { useLmBackend, useLmExpert } from "@agent-smith/brain";

const output = ref("");
const loadingProgress = ref(0);
const isModelLoaded = ref(false);
const isRunningInference = ref(false);
const q = ref("List the orbital periods of the planets of the solar system");

const ex = useLmExpert({
    name: "demo",
    backend: useLmBackend({ name: "browser", localLm: "browser" }),
    template: "chatml",
    model: {
        name: "smollm-360m",
        ctx: 2048,
        extra: {
            urls: "https://huggingface.co/HuggingFaceTB/smollm-360M-instruct-v0.2-Q8_0-GGUF/resolve/main/smollm-360m-instruct-add-basics-q8_0.gguf"
        }
    },
});

const onModelLoading: OnLoadProgress = (st) => {
    console.log(st.percent, "%");
    loadingProgress.value = st.percent;
}

async function loadModel() {
    await ex.loadModel(onModelLoading);
    console.log("Status", ex.state.get().status);
    ex.backend.setOnToken((t) => output.value += t);
    isModelLoaded.value = true;
}

async function infer() {
    isRunningInference.value = true;
    const p = new PromptTemplate("chatml")
        .replaceSystem("You are an AI assistant. Important: always use json to respond")
        .prompt(q.value)
    const res = await ex.think(
        p,
        { temperature: 0, min_p: 0.05, max_tokens: 512 }
    );
    isRunningInference.value = false;
    console.log(res.stats)
}

const code1 = `import { useLmExpert, useLmBackend } from "@agent-smith/brain";

const ex = useLmExpert({
    name: "demo",
    backend: useLmBackend({ name: "browser", localLm: "browser" }),
    template: "chatml",
    model: {
        name: "smollm-360m",
        ctx: 2048,
        extra: {
            urls: "https://huggingface.co/HuggingFaceTB/smollm-360M-instruct-v0.2-Q8_0-GGUF/resolve/main/smollm-360m-instruct-add-basics-q8_0.gguf"
        }
    },
});`;

const code2 = `const onModelLoading = (st) => {
    console.log(st.percent, "%")
}

async function loadModel() {
    await ex.loadModel(onModelLoading);
}`;
</script>