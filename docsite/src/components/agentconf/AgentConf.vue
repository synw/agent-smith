<template>
    <div>
        <div class="w-full h-full flex">
            <div v-if="!isPinging">
                <div v-if="brain.backends.length == 0" class="flex flex-col space-y-3">
                    <div>Supported local backends: Llama.cpp, Koboldcpp, Ollama</div>
                    <div>Note for Ollama: you need to allow the cors origin using an env
                        variable:<br><br><code>export OLLAMA_ORIGINS="http://0.0.0.0,https://synw.github.io"</code>
                    </div>
                    <div class="pt-2 flex flex-row space-x-3 items-center">
                        <button class="btn warning" @click="ping()">Ping local servers</button>
                        <template v-if="!disableBrowser">
                            <div>or</div>
                            <button class="btn success" @click="initBrowserBackend()">Use an in browser expert</button>
                        </template>
                    </div>
                </div>
                <div v-else>
                    <div v-for="backend in brain.backends" class="flex flex-col">
                        <div v-if="['koboldcpp', 'llamacpp'].includes(backend.lm.providerType)" class="flex flex-col">
                            <div>
                                Found a <span class="font-semibold">{{ backend.name }}</span> backend with
                                model <span class="font-semibold">{{ backend.lm.model.name }}</span>
                            </div>
                            <div class="mt-5">
                                <cpp-models :backend="backend" @end="pickExpert(backend, $event)"
                                    @cancel="removeBackend(backend.name)"></cpp-models>
                            </div>
                        </div>
                        <div v-else-if="backend.lm.providerType == 'ollama'" class="flex flex-col">
                            <template v-if="brain.ex.name == 'ollama'">
                                <div>
                                    Using a <span class="font-semibold">{{ backend.name }}</span> backend with
                                    model <span class="font-semibold">{{ backend.lm.model.name }}</span>
                                </div>
                                <div class="mt-5">
                                    <button class="btn warning"
                                        @click="removeExpert('ollama'); removeBackend('ollama')">Change</button>
                                </div>
                            </template>
                            <template v-else>
                                <div>
                                    Using a <span class="font-semibold">{{ backend.name }}</span> backend. Pick a model:
                                </div>
                                <div class="mt-5">
                                    <ollama-models :backend="backend" :backend-conf="useOllamaConf(backend)"
                                        @end="pickExpert(backend, $event)"
                                        @cancel="removeExpert('ollama'); removeBackend('ollama')"></ollama-models>
                                </div>
                            </template>
                        </div>
                        <div v-else>
                            <div v-if="brain.experts.find(e => e.name == 'browser')" class="flex flex-col space-y-5">
                                <div>
                                    Using in browser expert with model
                                    <span class="font-semibold">{{ backend.lm.model.name }}</span>
                                </div>
                                <div>
                                    <button class="btn warning"
                                        @click="removeExpert('browser'); removeBackend('browser')">Change</button>
                                </div>
                            </div>
                            <browser-model v-else @cancel="removeExpert('browser'); removeBackend('browser')"
                                @end="pickExpert(brain.backend('browser'), $event)"></browser-model>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="w-full h-full txt-semilight flex flex-col items-center mt-16 space-y-12">
                <loading-spinner class="text-6xl"></loading-spinner>
                <div>Pinging local inference servers ...</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { brain } from '@/agent/agent';
import { ref } from 'vue';
import LoadingSpinner from '@/widgets/LoadingSpinner.vue';
import { LmBackend, LmExpert, useLmBackend, useLmExpert } from '@agent-smith/brain';
/*import { useLmBackend } from "../../../../packages/brain/src/backend";
import { useLmExpert } from "../../../../packages/brain/src/expert";
import { LmExpert, LmBackend } from "../../../../packages/brain/src/interfaces";*/
import CppModels from './CppModels.vue';
import OllamaModels from './OllamaModels.vue';
import { LmExpertConfDef } from '@/interfaces';
import { useRoute, useRouter } from 'vue-router';
import { useOllamaConf } from '@/agent/ollama_conf';
import { msg } from '@/services/notify';
import BrowserModel from './BrowserModel.vue';

defineProps({
    disableBrowser: {
        type: Boolean,
        default: false,
    }
})

const emit = defineEmits(["end"]);

const isPinging = ref(false);
const route = useRoute();
const router = useRouter();
const from = route.query?.from;

function initBrowserBackend(): LmBackend {
    isPinging.value = true;
    let bc: LmBackend;
    try {
        bc = brain.backend("browser")
    } catch {
        bc = useLmBackend({
            name: "browser",
            localLm: "browser",
        });
        //console.log("Create backend", bc);
        brain.addBackend(bc);
    };
    isPinging.value = false;
    return bc
}

function removeBackend(name: string) {
    isPinging.value = true;
    try {
        brain.removeBackend(name);
    } catch {
    }
    isPinging.value = false;
}

function removeExpert(name: string) {
    isPinging.value = true;
    try {
        brain.removeExpert(name);
        if (brain.ex.name == name) {
            brain.setDefaultExpert({ name: "dummydefault" } as LmExpert);
        }
    } catch {
    }
    isPinging.value = false;
}

async function pickExpert(backend: LmBackend, spec: LmExpertConfDef) {
    const ex = useLmExpert({
        name: backend.name,
        backend: backend,
        model: { name: spec.modelName, ctx: spec.modelCtx },
        template: spec.templateName,
    });
    if (ex.backend.lm.providerType == 'ollama') {
        await ex.loadModel()
    }
    brain.addExpert(ex);
    brain.setDefaultExpert(ex);
    if (from) {
        router.push(from.toString());
    }
    emit("end");
    msg.success(`Expert ${ex.name} is ready`, `Model: ${ex.lm.model.name} \nContext: ${ex.lm.model.ctx}`);
}

async function ping() {
    isPinging.value = true;
    await brain.initLocal();
    //console.log(brain.backends);
    isPinging.value = false;
}
</script>