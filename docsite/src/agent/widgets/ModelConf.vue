<template>
    <div>
        <div v-if="isTrying" class="p-12 w-full flex flex-row items-center justify-center">
            <loading-spinner class="text-5xl"></loading-spinner>
            <div class="txt-light ml-3">Checking inference server ...</div>
        </div>
        <template v-else>
            <div class="flex flex-col space-y-3" v-if="brainState.isOn">
                <div>Server: {{ brain.ex.lm.providerType }}</div>
                <div v-if="brain.ex.lm.providerType != 'ollama'">
                    Model: {{ model.name.replace("koboldcpp/", "") }}</div>
                <div v-else>
                    <div v-if="model.name.length > 0">
                        Model: {{ model.name }}
                        <button class="btn ml-3 lighter text-sm px-2 py-1" @click="pickOtherModel();">
                            Pick another model
                        </button>
                    </div>
                    <template v-else>
                        <button class="btn ml-3 lighter text-sm px-2 py-1" @click="toggleModelsPanel($event);">
                            Pick a model
                        </button>
                        <OverlayPanel ref="modelsPanel">
                            <div class="flex flex-row space-x-2 items-center">
                                <div>Context size:</div>
                                <div class="w-8">
                                    <InputNumber class="w-8" v-model="ctxInput" :min="2048" :step="2048" showButtons />
                                </div>
                            </div>
                            <div class="p-3 flex flex-wrap gap-3 w-[36rem]">
                                <div v-for="mod in brain.ex.lm.models" class="">
                                    <button class="btn light" @click="chooseModel(mod.name); toggleModelsPanel($event)">
                                        {{ mod.name }}
                                    </button>
                                </div>
                            </div>
                        </OverlayPanel>
                    </template>
                </div>
                <div>Context size: {{ model.ctx }} tokens</div>
                <div>Template: <span class="font-semibold">{{ template }}</span>
                    <button class="btn ml-3 lighter text-sm px-2 py-1" @click="toggleTemplatePanel($event);">
                        Pick another template
                    </button>
                    <OverlayPanel ref="templatePanel">
                        <div class="p-3 flex flex-wrap gap-3 w-[64rem]">
                            <div v-for="tpl in templates" class="">
                                <button class="btn light" @click="chooseTemplate(tpl); toggleTemplatePanel($event)">
                                    {{ tpl.name }}
                                </button>
                            </div>
                        </div>
                    </OverlayPanel>
                </div>
                <div>
                    <button class="btn success mt-5" @click="init()">Ping server again</button>
                </div>
            </div>
            <div v-else class="flex flex-col">
                <div>The inference server is down: please run a local Llama.cpp, Koboldcpp or Ollama instance and try
                    again. <br />Note for Ollama: you need to allow the cors origin using an env variable:<br /><br />
                    <code>export OLLAMA_ORIGINS="http://0.0.0.0,https://synw.github.io"</code>
                </div>
                <div>
                    <button class="btn warning mt-5" @click="init()">Try again</button>
                </div>
            </div>
        </template>

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import InputNumber from 'primevue/inputnumber';
import { brain } from "../agent";
import OverlayPanel from 'primevue/overlaypanel';
import LoadingSpinner from "@/widgets/LoadingSpinner.vue";
import { template, model, initLm, tfm } from "../state";
import { LmTemplate, templates } from "modprompt";
import { useStore } from "@nanostores/vue";

const isTrying = ref(false);
const templatePanel = ref();
const modelsPanel = ref();
const ctxInput = ref(2048);

let brainState = useStore(brain.state);

async function persistTemplate(templ: string) {
    if (template.value.length > 0 && template.value !== "none") {
        // persist state
        await tfm.set(templ, brain.ex.lm.model.name)
    }
}

async function chooseTemplate(tpl: LmTemplate) {
    template.value = tpl.id;
    await persistTemplate(tpl.id);
    brain.ex.setTemplate(template.value);
}

function pickOtherModel() {
    model.name = "";
    toggleModelsPanel(true)
}

async function chooseModel(mod: string) {
    await brain.ex.lm.loadModel(mod, ctxInput.value);
    model.name = brain.ex.lm.model.name;
    model.ctx = brain.ex.lm.model.ctx;
}

function toggleTemplatePanel(evt) {
    templatePanel.value.toggle(evt)
}

function toggleModelsPanel(evt) {
    modelsPanel.value.toggle(evt)
}

async function init() {
    await initLm(isTrying);
    brainState = useStore(brain.state);
}

onMounted(() => {
    if (!brain.state.get().isOn) {
        init()
    }
})
</script>