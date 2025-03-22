<template>
    <div>
        <div v-if="isPinging" class="p-12 w-full flex flex-row items-center justify-center">
            <loading-spinner class="text-5xl"></loading-spinner>
            <div class="txt-light ml-3">Checking inference server ...</div>
        </div>
        <template v-else>
            <div class="flex flex-col space-y-3" v-if="conf.isOn">
                <div class="text-2xl txt-light">
                    <span class="capitalize" v-html="brain.ex.lm.providerType"></span>
                    server
                </div>
                <div v-if="brain.ex.lm.providerType != 'ollama'">
                    Model: {{ conf.model.name.replace("koboldcpp/", "") }}</div>
                <div v-else>
                    <div v-if="conf.model.name.length > 0">
                        Model: {{ conf.model.name }} ({{ conf.model.ctx }})
                        <button class="btn ml-3 lighter text-sm px-2 py-1" @click="conf.pickOtherModel();">
                            Pick another model
                        </button>
                    </div>
                    <template v-else>
                        <div class="p-3 flex flex-wrap gap-3">
                            <div v-for="size in Object.keys(conf.models).sort()" class="w-[24rem]">
                                {{ size }}
                                <div v-for="mod in conf.models[size]">
                                    <button class="btn" @click="pickModel(mod.name, ctxInput);">
                                        {{ mod.name }} / {{ mod.info?.quant }}
                                    </button>
                                </div>

                            </div>
                        </div>
                        <div class="flex flex-row space-x-2 items-center">
                            <div>Context size:</div>
                            <div class="w-8">
                                <InputNumber class="w-8" v-model="ctxInput" :min="2048" :step="2048" showButtons />
                            </div>
                        </div>
                    </template>
                </div>
                <div v-if="conf.hasModel.value">Template: <span class="font-semibold">{{ conf.template.value }}</span>
                    <button class="btn ml-3 lighter text-sm px-2 py-1" @click="toggleTemplatePanel($event);">
                        Pick another template
                    </button>
                    <OverlayPanel ref="templatePanel">
                        <div class="p-3 flex flex-wrap gap-3 w-[64rem]">
                            <div v-for="tpl in templates" class="">
                                <button class="btn light" @click="pickTemplate(tpl, $event);">
                                    {{ tpl.name }}
                                </button>
                            </div>
                        </div>
                    </OverlayPanel>
                </div>
                <div class="flex flex-row space-x-2">
                    <button class="btn success mt-5" @click="validate();"
                        :disabled="!conf.hasTemplate">Validate</button>
                    <button class="btn mt-5" @click="init()">Ping server again</button>
                </div>
            </div>
            <div v-else class="flex flex-col">
                <div>The inference server is down</div>
                <div>
                    <button class="btn warning mt-5" @click="init()">Try again</button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { templates } from "modprompt";
import { useModelConf } from "./use_model_conf";
import { AgentBrain } from "@agent-smith/brain";
import { useRoute, useRouter } from "vue-router";
import LoadingSpinner from "../../widgets/LoadingSpinner.vue";
import OverlayPanel from "primevue/overlaypanel";

const props = defineProps({
    conf: {
        type: Object as () => ReturnType<typeof useModelConf>,
        required: true,
    },
    brain: {
        type: Object as () => AgentBrain,
        required: true,
    }
})

const isPinging = ref(false);
const ctxInput = ref(2048);
const isValidated = ref(false);
const templatePanel = ref();

const route = useRoute();
const router = useRouter();
const from = route.query.from?.toString() ?? "/";

async function init() {
    await props.conf.initLm(isPinging)
}

function validate() {
    //    props.conf.template.value = templ.value;
    isValidated.value = true
    router.push(from)
}

async function pickModel(m: string, ctx: number) {
    await props.conf.chooseModel(m, ctx);
    await props.conf.getTemplate();
}

function pickTemplate(tpl, evt) {
    console.log("TPL", `|${tpl.id}|`);
    props.conf.chooseTemplate(tpl);
    toggleTemplatePanel(evt)
}

function toggleTemplatePanel(evt) {
    templatePanel.value.toggle(evt)
}

onBeforeMount(() => init());
</script>