<template>
    <div>
        <div class="prosed">
            <h1>Multiple experts</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>We can use different experts for different tasks, in sequence or
                parallel. An expert is basically a connection to a server that uses
                a specific model.
            </div>
            <div>To make the interactive examples work run two local instances of Koboldcpp with different models. We
                will use small models for this example so that it can work with low memory requirements:
            </div>
            <div class="prose">
                <ul>
                    <li><a href="https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF">Tinyllama Chat</a> (1B)
                        as "the kid" expert</li>
                    <li><a href="https://huggingface.co/TheBloke/phi-2-GGUF">Phi 2</a> (3B) as "the
                        corrector" expert that will fix the mistakes of the first model
                    </li>
                </ul>
            </div>
            <div>Run both servers with the second one using the <kbd>--port 5002</kbd> option. Let's create our experts:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="ts"></static-code-block>
            </div>
            <div>We now have two experts:</div>
            <div>
                <div v-for="(expert, i) in bob.brain.experts" class="txt-light">
                    {{ i + 1 }}. {{ expert.name }} <span v-if="expert.name == bob.brain.ex.name">(current
                        default)</span>
                </div>
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="html"></static-code-block>
            </div>
            <div class="prose">
                <h2>Query experts</h2>
            </div>
            <div>We can query the experts one by one or simultaneously:</div>
            <div>
                <Textarea class="w-[50rem] mt-3" v-model="q1" :rows="1" />
            </div>
            <div class="flex flex-row space-x-3">
                <button class="btn semilight" @click="runQ1('kid');">Run the
                    query with the kid</button>
                <button class="btn semilight" @click="runQ1('corrector');">Run the
                    query with the corrector</button>
                <button class="btn semilight" @click="runQ1('corrector'); runQ1('kid')">Run the
                    query with both in paralel</button>
            </div>
            <div class="flex flex-row w-full space-x-3" v-if="runningQ == 'q1'">
                <div class="w-1/2 txt-light">{{ kidStream }}</div>
                <div class="w-1/2">{{ correctorStream }}</div>
            </div>
            <div>We use the <kbd>thinkx</kbd> method to query a specific expert:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="ts"></static-code-block>
            </div>
            <div>The template part:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="html"></static-code-block>
            </div>
            <div class="prose">
                <h2>Example workflow</h2>
            </div>
            <div>In this example we are going to create a workflow that uses our experts with these steps:</div>
            <div class="prose">
                <ol>
                    <li>The kid expert will be asked to produce some json</li>
                    <li>The json validity of the output is checked</li>
                    <li>If the output is not valid json, attempt to fix it with the corrector expert</li>
                </ol>
            </div>
            <div>
                <Textarea class="w-[50rem] mt-3" v-model="q2" :rows="1" disabled />
            </div>
            <div class="flex flex-row space-x-3">
                <button class="btn semilight" @click="runQ2();">Run the steps</button>
            </div>
            <div v-if="runningQ == 'q2'" class="flex flex-row w-full space-x-3">
                <div class="w-1/3 txt-light">{{ kidStream }}</div>
                <div class="w-2/3 flex flex-col">
                    <div>{{ status.operation }}</div>
                    <div class="mt-3">{{ status.result }}</div>
                </div>
            </div>
            <div>Let's start by creating some functions to validate and fix json:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code5" lang="ts"></static-code-block>
            </div>
            <div>Now the fix json with retries part and the state management:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code6" lang="ts"></static-code-block>
            </div>
            <div>And finally the function to run all steps:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code7" lang="ts"></static-code-block>
            </div>
            <div class="pt-5">
                <a href="javascript:openLink('/the_brain/templates/basics')">Next: templates: basics</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useStore } from '@nanostores/vue';
import Textarea from 'primevue/textarea';
import { StaticCodeBlock } from "@docdundee/vue";
import { hljs } from "@/conf";
import { bob } from "@/agent/agent2";

const runningQ = ref<"q1" | "q2">("q1");

const kidStream = useStore(bob.brain.expert("kid").stream);
const correctorStream = useStore(bob.brain.expert("corrector").stream);
const status = reactive({
    operation: "",
    result: "",
})

//const q1 = ref("Write a list of the planets of the solar system in a json array. Important: return only the planets names");
const q1 = ref("Which planet has the most moons? Return the planet name only");
const q2 = ref("List the 3 biggest websites in json");

async function check(): Promise<boolean> {
    if (!bob.brain.state.get().isOn) {
        const found = await bob.brain.discover();
        if (!found) {
            console.warn("Can not run query: the inference server is down")
            return false
        }
    }
    return true
}

async function runQ1(expertName: string) {
    await check();
    runningQ.value = "q1";
    await bob.brain.thinkx(expertName,
        q1.value,
        {
            temperature: 0,
            min_p: 0.05,
            repeat_penalty: 1.1,
            max_tokens: 200,
        },
        {
            verbose: true,
        })
}

function validateJson(text: string): boolean {
    try {
        JSON.parse(text);
        return true
    } catch (e) {
        return false
    }
}

async function fixJson(text: string): Promise<string> {
    console.log("Fixing invalid json");
    const _prompt = `convert this to a valid json array:

\`\`\`
${text}
\`\`\``;
    const resp = await bob.brain.thinkx("corrector",
        _prompt,
        {
            temperature: 0,
            min_p: 0.05,
            max_tokens: 500,
        })
    return resp.text
}

async function checkFixJson(text: string, max_attempt = 3, attempt = 0): Promise<{ valid: boolean, text: string }> {
    if (attempt > max_attempt) {
        status.operation = "Unable to validate json";
        return { text: text, valid: false }
    }
    let res = "";
    let done = false;
    status.operation = "Checking json validity";
    const isValid = validateJson(text);
    if (!isValid) {
        status.operation = `Attempting to fix json, attempt ${attempt + 1}`;
        const validJson = await fixJson(text);
        if (!validateJson(validJson)) {
            const r = await checkFixJson(text, attempt + 1);
            if (r.valid) {
                done = true;
                res = r.text;
                status.operation = "Fixed the data to valid json:";
                status.result = res;
            }
        } else {
            res = validJson;
            status.result = res;
            done = true;
            status.operation = "Fixed the data to valid json:"
        }
    } else {
        done = true;
        res = text;
        status.result = res;
        status.operation = "Fixed the data to valid json:"
    }
    return { text: res, valid: done }
}

async function runQ2() {
    await check();
    runningQ.value = "q2";
    status.result = "";
    status.operation = ""
    console.log("Step 1: query with the kid");
    const resp = await bob.brain.thinkx("kid",
        q2.value,
        {
            temperature: 0,
            min_p: 0.05,
            max_tokens: 500,
        });
    console.log("Result:", resp.text);
    console.log("Step 2: validating json");
    const { text, valid } = await checkFixJson(resp.text);
    if (valid) {
        console.log("Valid json:", text);
    } else {
        console.warn("Unable to fix json:", text)
    }
}

const code1 = `import { useAgentSmith } from "@agent-smith/body";
import { useLmExpert, useAgentBrain, LmBackendSpec } from "@agent-smith/brain";

// first expert
const kid = useLmExpert({
    name: "kid",
    localLm: "koboldcpp",
    templateName: "zephyr",
});
// second expert
const lm: LmBackendSpec = {
    name: "Corrector",
    providerType: "koboldcpp",
    serverUrl: "http://localhost:5002",
    enabled: false,
    apiKey: "",
};
const corrector = useLmExpert({
    name: "corrector",
    backend: lm,
    templateName: "phi",
});

const bob = useAgentSmith({
    name: "Bob",
    modules: [useAgentBrain([kid, corrector])],
});

export { bob }`;

const code2 = `<div v-for="(expert, i) in bob.brain.experts" class="txt-light">
    {{ i + 1 }}. {{ expert.name }} <span v-if="expert.name == bob.brain.ex.name">(default)</span>
</div>`;

const code3 = `const q1 = ref("Which planet has the most moons? Return the planet name only");

async function check(): Promise<boolean> {
    if (!bob.brain.state.get().isOn) {
        const found = await bob.brain.discover();
        if (!found) {
            console.warn("Can not run query: the inference server is down")
            return false
        }
    }
    return true
}

async function runQ1(expertName: string) {
    await check();
    await bob.brain.thinkx(expertName,
        q1.value, // the prompt from the textarea
        {
            temperature: 0,
            min_p: 0.05,
            max_tokens: 200,
        },
        {
            verbose: true,
        })
}`;

const code4 = `<div>
    <Textarea class="w-[50rem] mt-3" v-model="q1" :rows="1" />
</div>
<div class="flex flex-row space-x-3">
    <button class="btn semilight" @click="runQ1('kid');">Run the
        query with the kid</button>
    <button class="btn semilight" @click="runQ1('corrector');">Run the
        query with the corrector</button>
    <button class="btn semilight" @click="runQ1('corrector'); runQ1('kid')">Run the
        query with both in paralel</button>
</div>`;

const code5 = `function validateJson(text: string): boolean {
    try {
        JSON.parse(text);
        return true
    } catch (e) {
        return false
    }
}

async function fixJson(text: string): Promise<string> {
    console.log("Fixing invalid json");
    const _prompt = \`convert this to a valid json array:

\`\`\`
\${text}
\`\`\`\`;
    const resp = await bob.brain.thinkx("corrector",
        _prompt,
        {
            temperature: 0,
            min_p: 0.05,
            max_tokens: 500,
        })
    return resp.text
}`;

const code6 = `import { reactive } from 'vue';

const status = reactive({
    operation: "",
    result: "",
});

async function checkFixJson(text: string, max_attempt = 3, attempt = 0): Promise<{ valid: boolean, text: string }> {
    if (attempt > max_attempt) {
        status.operation = "Unable to validate json";
        return { text: text, valid: false }
    }
    let res = "";
    let done = false;
    status.operation = "Checking json validity";
    const isValid = validateJson(text);
    if (!isValid) {
        status.operation = \`Attempting to fix json, attempt \${attempt + 1}\`;
        const validJson = await fixJson(text);
        if (!validateJson(validJson)) {
            const r = await checkFixJson(text, attempt + 1);
            if (r.valid) {
                done = true;
                res = r.text;
                status.operation = "Fixed the data to valid json:";
                status.result = res;
            }
        } else {
            res = validJson;
            status.result = res;
            done = true;
            status.operation = "Fixed the data to valid json:"
        }
    } else {
        done = true;
        res = text;
        status.result = res;
        status.operation = "Fixed the data to valid json:"
    }
    return { text: res, valid: done }
}`;

const code7 = `async function runQ2() {
    await check();
    status.result = "";
    status.operation = ""
    console.log("Step 1: query with the kid");
    const resp = await bob.brain.thinkx("kid",
        q2.value,  // the prompt
        {
            temperature: 0,
            min_p: 0.05,
            max_tokens: 500,
        });
    console.log("Result:", resp.text);
    console.log("Step 2: validating json");
    const { text, valid } = await checkFixJson(resp.text);
    if (valid) {
        console.log("Valid json:", text);
    } else {
        console.warn("Unable to fix json:", text)
    }
}`;
</script>