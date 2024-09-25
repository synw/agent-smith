<template>
    <div>
        <table class="table-auto border-collapse border bord-lighter min-w-56">
            <thead>
                <tr>
                    <th class="w-1/6">Size</th>
                    <th class="w-4/6">Name</th>
                    <th class="w-1/6">Quant</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="size of Object.keys(backendConf.models)" class="flex flex-col space-y-3">
                    <tr>
                        <td colspan="3" class="superlight p-1">{{ size }}</td>
                    </tr>
                    <template v-for="model in backendConf.models[size]">
                        <tr class="cursor-pointer" :class="modelRowCls(model.name)" @click="selectModel(model)">
                            <td class="p-3">{{ model?.info?.size }}</td>
                            <td class="p-3">{{ model.name }}</td>
                            <td class="p-3">{{ model?.info?.quant }}</td>
                        </tr>
                        <tr v-if="selectedModel == model.name" class="superlight">
                            <td colspan="3" class="p-3">
                                <div class="w-full flex flex-col space-y-3">
                                    <div class="flex flex-row space-x-2 items-center">
                                        <div>Context size:</div>
                                        <div>
                                            <InputNumber v-model="ctx" :min="-1" :step="2048" inputClass="w-24"
                                                :allowEmpty="true" showButtons />
                                        </div>
                                        <button class="btn text-sm rounded-xl px-2 py-1 lighter"
                                            @click="showCtxPicker = true" v-if="!showCtxPicker">Select ctx</button>
                                    </div>
                                    <div v-if="showCtxPicker">
                                        <CtxPicker :ctx="ctx" @select="selectCtx($event)"></CtxPicker>
                                    </div>
                                    <div class="flex flex-row space-x-2 items-center">
                                        <div>Template: {{ template }}</div>
                                        <button class="btn text-sm rounded-xl px-2 py-1 lighter"
                                            @click="showTemplatePicker = true" v-if="!showTemplatePicker">Select
                                            template</button>
                                    </div>
                                </div>
                                <TemplatePicker v-if=showTemplatePicker class="mt-3" @select="selecttemplate($event)">
                                </TemplatePicker>
                                <div class="mt-3 flex flex-row justify-center items-center">
                                    <button class="btn success" @click="pickModel(model)">Select</button>
                                    <button class="btn txt-warning font-semibold"
                                        @click="selectedModel = ''">Cancel</button>
                                </div>
                            </td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </table>
        <div class="mt-5">
            <button class="btn warning" @click="emit('cancel')">Cancel</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useOllamaConf } from '@/agent/ollama_conf';
import { LmBackend } from '@agent-smith/brain';
import { ModelConf } from '@locallm/types';
import { onBeforeMount, ref } from 'vue';
import TemplatePicker from './TemplatePicker.vue';
import InputNumber from 'primevue/inputnumber';
import CtxPicker from './CtxPicker.vue';
import { LmExpertConfDef } from '@/interfaces';

const props = defineProps({
    backend: {
        type: Object as () => LmBackend,
        required: true,
    },
    backendConf: {
        type: Object as () => ReturnType<typeof useOllamaConf>,
        required: true,
    }
});

const emit = defineEmits(["end", "cancel"]);

const showCtxPicker = ref(false);
const showTemplatePicker = ref(false);
const template = ref("none");
const selectedModel = ref("");
const pickTemplate = ref(false);
const ctx = ref(2048);

async function selectModel(m: ModelConf) {
    //console.log("SEL", m.name, selectedModel.value);
    showCtxPicker.value = false;
    showTemplatePicker.value = false;
    if (m.name == selectedModel.value) {
        selectedModel.value = "";
        return
    }
    selectedModel.value = m.name;
    // template
    const tpl = await props.backendConf.getTemplate(m.name);
    //console.log("TPL", tpl);
    if (!tpl) {
        pickTemplate.value = true
        return
    }
    template.value = tpl;
    if (m.ctx) {
        if (m.ctx > 0) {
            ctx.value = m.ctx
        }
    }
    if (isNaN(ctx.value)) {
        showCtxPicker.value = true
    }
    if (tpl == "none") {
        showTemplatePicker.value = true
    }
}

async function pickModel(model: ModelConf) {
    //console.log("Pick model", model.name);
    //await props.backend.lm.loadModel(model.name, model.ctx);
    const exDef: LmExpertConfDef = {
        modelName: model.name,
        modelCtx: ctx.value,
        templateName: template.value,
    }
    emit("end", exDef)
}

function selectCtx(n: number) {
    ctx.value = n;
    showCtxPicker.value = false
}

function selecttemplate(t: string) {
    template.value = t;
    showTemplatePicker.value = false
}

function modelRowCls(m: string): Array<string> {
    const end = new Array<string>();
    if (m == selectedModel.value) {
        end.push("font-semibold", "lighter")
    } else if (props.backend.lm.model.name !== m) {
        end.push('txt-light')
    }
    return end
}

async function init() {
    await props.backendConf.init();
}

onBeforeMount(() => init())
</script>

<style lang="sass" scoped>
th
    @apply lighter border bord-lighter
td
    @apply border bord-lighter
</style>