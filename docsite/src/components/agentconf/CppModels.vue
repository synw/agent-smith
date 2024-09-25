<template>
    <div class="flex flex-col space-y-3">
        <div class="flex flex-row space-x-2 items-center">
            <div>Template: <span class="font-semibold">{{ templateName }}</span></div>
            <button class="btn text-sm rounded-xl px-2 py-1 lighter" @click="pickTemplate = true"
                :disabled="pickTemplate">Select
                template</button>
        </div>
        <div v-if="pickTemplate">
            <TemplatePicker @select="selectTemplate($event)"></TemplatePicker>
        </div>
        <div v-if="templateName != '' && modelName != ''" class="text-center pt-3">
            <button class="btn success" @click="validate()">Validate</button>
            <button class="btn ml-3" v-if="pickTemplate" @click="pickTemplate = false">Cancel</button>
            <button class="btn ml-3" v-else @click="emit('cancel')">Cancel</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import TemplatePicker from '@/components/agentconf/TemplatePicker.vue';
import { LmExpertConfDef } from '@/interfaces';
import { useTemplateForModel } from '@agent-smith/tfm';
import { LmBackend } from '@agent-smith/brain';

const props = defineProps({
    backend: {
        type: Object as () => LmBackend,
        required: true
    }
});

const emit = defineEmits(["end", "cancel"]);

const modelName = ref("");
const modelCtx = ref();
const templateName = ref("");
const pickTemplate = ref(false);
const tfm = useTemplateForModel();

async function init() {
    let hasModel = false;
    if (props.backend.lm.model.name == "") {
        if (props.backend.state.get().isUp) {
            await props.backend.lm.info()
            modelName.value = props.backend.lm.model.name.replace("koboldcpp/", "");
            modelCtx.value = props.backend.lm.model.ctx;
            hasModel = true
        }
    } else {
        modelName.value = props.backend.lm.model.name.replace("koboldcpp/", "");
        modelCtx.value = props.backend.lm.model.ctx;
        hasModel = true
    }
    if (hasModel) {
        const tp = tfm.guess(props.backend.lm.model.name);
        if (tp) {
            templateName.value = tp
        }
    }
    //console.log("M=", props.backend.lm.model);
}

async function validate() {
    const exDef: LmExpertConfDef = {
        modelName: modelName.value,
        modelCtx: modelCtx.value,
        templateName: templateName.value,
    }
    emit("end", exDef)
}

function selectTemplate(t: string) {
    templateName.value = t;
    pickTemplate.value = false;
}

onBeforeMount(() => init());
</script>