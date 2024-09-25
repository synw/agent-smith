<template>
    <div>
        <div class="prosed">
            <h1>Experts</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>Experts are attached to the brain. An expert is:</div>
        </div>
        <div class="prosed">
            <ul>
                <li><span class="font-semibold">A backend</span>: a remote or local inference server, or the browser
                </li>
                <li><span class="font-semibold">A model</span>: a defined language model
                </li>
                <li><span class="font-semibold">A template</span>: a template format to use with the model
                </li>
            </ul>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>An expert can run inference queries.</div>
            <div>Initialize an expert:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="ts"></static-code-block>
            </div>
            <!-- div>Run an inference query:</div>
            <div>{{ brain.ex.name }} / {{ brain.ex.lm.model.name }} / {{ brain.ex.template.name }} /
                {{ state.status }}
            </div>
            <div>{{ brain.ex.lm.model }}</div -->
            <div>Experts can be attached to the brain: at initialization time:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="ts"></static-code-block>
            </div>
            <div>At anytime:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="ts"></static-code-block>
            </div>
            <div>Remove an expert:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="ts"></static-code-block>
            </div>
        </div>
        <div class="prosed">
            <h2>State</h2>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>The expert have a state. Available properties:</div>
        </div>
        <div class="prosed">
            <ul>
                <li><kbd>isStreaming</kbd>: <code>true</code> if the model is emiting token
                </li>
                <li><kbd>isThinking</kbd>: <code>true</code> if either the model is emiting
                    token or ingesting a prompt
                </li>
                <li><kbd>status</kbd>: the expert status: possible values:
                    <ul>
                        <li><span class="font-semibold">unavailable</span>: the backend is down or the model can not be
                            loaded</li>
                        <li><span class="font-semibold">available</span>: the backend is up and the model can be
                            loaded</li>
                        <li><span class="font-semibold">ready</span>: the backend is up and the model is
                            loaded</li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>Use <kbd>checkStatus</kbd> to update the expert's status:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code5" lang="ts"></static-code-block>
            </div>
        </div>
        <div class="prosed">
            <h2>Inference</h2>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>Once the expert ready it can run inference queries.</div>
            <div v-if="!hasExpert">
                <div class="text-lg font-medium">Configure an expert for the interactive demo:</div>
                <AgentConf class="p-3 mt-3 border rounded-md" @end="init()"></AgentConf>
            </div>
            <template v-else>
                <template v-if="state.status == 'ready'">
                    <Textarea class="w-[50rem] mt-3" v-model="q" :rows="2" />
                    <div class="flex flex-row space-x-2">
                        <button class="btn semilight" @click="runQ()" :disabled="state.isThinking">Run
                            the query</button>
                        <button v-if="state.isThinking" @click="brain.ex.abortThinking()">Abort</button>
                    </div>
                    <div>
                        <pre class="font-light">{{ stream }}</pre>
                    </div>
                </template>
                <template v-else>expert not ready: {{ state.status }}</template>
            </template>
            <div>Run an inference query:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code6" lang="ts"></static-code-block>
            </div>
            <div>Abort a running inference query:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code7" lang="ts"></static-code-block>
            </div>
            <div>Inference parameters:</div>
        </div>
        <div class="prosed">
            <div>
                <ul>
                    <li><strong>stream</strong>: (<code>boolean</code>) Indicates if results should be streamed
                        progressively.</li>
                    <li><strong>model</strong>: (<code>ModelConf</code>) The model configuration details for inference.
                    </li>
                    <li><strong>template</strong>: (<code>string</code>) The template to use, for the backends that
                        support it.</li>
                    <li><strong>max_tokens</strong>: (<code>number</code>) The max number of tokens to emit.</li>
                    <li><strong>top_k</strong>: (<code>number</code>) Limits the result set to the top K results.</li>
                    <li><strong>top_p</strong>: (<code>number</code>) Filters results based on cumulative probability.
                    </li>
                    <li><strong>min_p</strong>: (<code>number</code>) The minimum probability for a token to be
                        considered, relative
                        to the probability of the most likely token.</li>
                    <li><strong>temperature</strong>: (<code>number</code>) Adjusts randomness in sampling; higher
                        values mean more
                        randomness.</li>
                    <li><strong>repeat_penalty</strong>: (<code>number</code>) Adjusts penalty for repeated tokens.</li>
                    <li><strong>tfs</strong>: (<code>number</code>) Set the tail free sampling value.</li>
                    <li><strong>stop</strong>: (<code>Array&lt;string&gt;</code>) List of stop words or phrases to halt
                        predictions.
                    </li>
                    <li><strong>grammar</strong>: (<code>string</code>) The gnbf grammar to use for grammar-based
                        sampling.</li>
                    <li><strong>images</strong>: (<code>Array&lt;string&gt;</code>) The base64 images data (for
                        multimodal models).
                    </li>
                    <li><strong>extra</strong>: (<code>Record&lt;string, any&gt;</code>) Extra parameters to include in
                        the payload
                    </li>
                </ul>
            </div>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>Detailled <a href="https://synw.github.io/locallm/types/interfaces/InferenceParams.html">inference
                    params api doc</a>
            </div>
        </div>
        <div class="prosed">
            <h2>Models</h2>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>An expert is associated with a model. If the backend is Ollama or the browser the expert
                will have to load the model, and can change model later. Note: when calling <code>think</code>
                the model will be automatically loaded if it is not loaded yet. The Koboldcpp and Llama.cpp
                backends can not switch models, so the initial model is always loaded.
            </div>
            <div>Load a the expert's model:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code8" lang="ts"></static-code-block>
            </div>
            <div>Load another model in Ollama:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code9" lang="ts"></static-code-block>
            </div>
            <div>Load another model in the browser: note the <code>extra.urls</code> param:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code10" lang="ts"></static-code-block>
            </div>
        </div>
        <div class="prosed">
            <h2>Templates</h2>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>Each expert is associated with a template, corresponding to the model used. To change a template:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code11" lang="ts"></static-code-block>
            </div>
            <div>The templates are managed using the <a href="https://github.com/synw/modprompt">Modprompt</a> library.
                They
                can be used for few shots prompting, history of turns, system messages and so on: check the
                <a href="javascript:openLink('/the_brain/templates/basics')">templates</a> section.
            </div>
            <div class="pt-5">
                <a href="javascript:openLink('/the_brain/brain')">Next: the brain</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { StaticCodeBlock } from "@docdundee/vue";
import { hljs } from "@/conf";
import { brain } from "@/agent/agent";
import { useStore } from "@nanostores/vue";
import { onBeforeMount, ref } from "vue";
import AgentConf from "@/components/agentconf/AgentConf.vue";
import Textarea from 'primevue/textarea';

let state: ReturnType<typeof useStore>;
let stream: ReturnType<typeof useStore>;
const hasExpert = ref(false);

const q = ref("Write a short list of the planets names of the solar system. Important: return only a markdown list.");

async function runQ() {
    console.log(brain.ex.template.prompt(q.value));
    await brain.think(q.value, {
        temperature: 0,
        min_p: 0.05,
        max_tokens: 200,
        extra: { raw: true }
    }, { verbose: true })
}

function init() {
    hasExpert.value = brain.experts.length > 0;
    if (hasExpert.value) {
        brain.ex.checkStatus();
        state = useStore(brain.ex.state);
        stream = useStore(brain.ex.backend.stream);
    }
}

const code1 = `import { useLmBackend, useLmExpert } from "@agent-smith/brain";

const model = "llama3.1:latest";
const ctx = 8192;
const templateName = "llama3";

const backend = useLmBackend({
    name: "ollama",
    localLm: "ollama",
});

const expert = useLmExpert({
    name: "llama",
    backend: backend,
    template: templateName,
    model: { name: model, ctx: ctx },
});`;

const code2 = `import { useAgentBrain } from "@agent-smith/brain";

const brain = useAgentBrain([backend], [expert]);`;

const code3 = `brain.addExpert(backend);`

const code4 = `brain.removeExpert("llama") // expert.name;`;

const code5 = `expert.checkStatus();

console.log("Is thinking:", expert.state.get().isThinking);
console.log("Is emiting:", expert.state.get().isEmiting);
console.log("Is thinking:", expert.state.get().status);`;

const code6 = `await expert.think(
    "Write a short list of the planets names of the solar system (...)", {
    temperature: 0,
    min_p: 0.05,
    max_tokens: 200,
})`;

const code7 = `expert.abortThinking()`;

const code8 = `expert.loadModel()`;

const code9 = `expert.setModel({ name: "llama3.1:latest", ctx: 8192 });
expert.loadModel()`;

const code10 = `expert.setModel({ 
    name: "Qwen2.5-0.5B-Instruct",
    ctx: 32768,
    extra: { 
        urls: "https://huggingface.co/bartowski/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/Qwen2.5-0.5B-Instruct-Q5_K_M.gguf"
    }
});
expert.loadModel()`;

const code11 = `expert.setTemplate("chatml")`;
onBeforeMount(() => init())
</script>