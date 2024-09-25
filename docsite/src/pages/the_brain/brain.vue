<template>
    <div>
        <div class="prosed">
            <h1>Brain</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>The brain is an interface to manage multiple experts and backends.</div>
        </div>
        <div class="prosed">
            <h2>Backends</h2>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>Initialize the brain with backends:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="ts"></static-code-block>
            </div>
            <div>Remove a backend:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="ts"></static-code-block>
            </div>
            <div>Add a backend:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="ts"></static-code-block>
            </div>
            <div>Get a backend:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="ts"></static-code-block>
            </div>
            <div>Get all backends:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code4b" lang="ts"></static-code-block>
            </div>
        </div>
        <div class="prosed">
            <h2>Experts</h2>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>Experts can be declared at initialization time or later.</div>
            <div>
                <static-code-block :hljs="hljs" :code="code5" lang="ts"></static-code-block>
            </div>
            <div>Declare experts at initialization time:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code6" lang="ts"></static-code-block>
            </div>
            <div>Add an expert:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code7" lang="ts"></static-code-block>
            </div>
            <div>Remove an expert:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code8" lang="ts"></static-code-block>
            </div>
            <div>Get an expert (will throw an error if not found):</div>
            <div>
                <static-code-block :hljs="hljs" :code="code9" lang="ts"></static-code-block>
            </div>
            <div>Get all experts:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code10" lang="ts"></static-code-block>
            </div>
            <div>The brain has a default expert. It will be set automatically on the first expert added. To set the
                default expert:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code11" lang="ts"></static-code-block>
            </div>
            <div>Get the default expert:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code12" lang="ts"></static-code-block>
            </div>
            <div>Get a list of usable expert (with status <code>ready</code> or <code>available</code>):</div>
            <div>
                <static-code-block :hljs="hljs" :code="code13" lang="ts"></static-code-block>
            </div>
        </div>
        <div class="prosed">
            <h2>Models</h2>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>Some backends can manage multiple models (Ollama and the browser) and some only one (Koboldcpp and
                Llama.cpp).
                Each of these backends can provide information about the models it supports. To get a list of models
                available per
                backend:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code14" lang="ts"></static-code-block>
            </div>
            <div>Get what backend is available for a given model (will return <code>null</code> if not found):</div>
            <div>
                <static-code-block :hljs="hljs" :code="code15" lang="ts"></static-code-block>
            </div>
            <div>Get an expert for a given model (will return <code>null</code> if not found):</div>
            <div>
                <static-code-block :hljs="hljs" :code="code16" lang="ts"></static-code-block>
            </div>
            <div>Get or create an expert for a given model (will return <code>null</code> if it can not be created - ex:
                no backend exists for this model).
                If a backend for the given model exists, it will be used and an expert named as the model name will
                be created. Useful to create experts on the fly for automated tasks.</div>
            <div>
                <static-code-block :hljs="hljs" :code="code17" lang="ts"></static-code-block>
            </div>
        </div>
        <div class="prosed">
            <h2>Inférence</h2>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>There are some convenience methods to use the default expert to run inference queries. Run
                a query using the defaut expert:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code18" lang="ts"></static-code-block>
            </div>
            <div>Run a query using a given expert:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code19" lang="ts"></static-code-block>
            </div>
            <div>Abort a running query:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code20" lang="ts"></static-code-block>
            </div>
            <div>Refer the the <a href="javascript:openLink('/the_brain/experts')">experts doc</a> for more details
                on inference.
            </div>
        </div>
        <div class="prosed">
            <h2>Auto discovery</h2>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>The brain has some function to ping the declared backends and experts and check their state. It
                can also auto discover local backend:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code21" lang="ts"></static-code-block>
            </div>
            <div>This will check if any Llama.cpp, Koboldcpp or Ollama is running locally (with their defaults
                settings). It
                will add the backends to the brain, unless the <kbd>setState</kbd> optional first param is
                <code>false</code> (to just check the
                backends and not auto add them to the brain). Second parameter is for the verbosity, set it to
                <code>true</code> for a verbose console output.
            </div>
            <div>Discover the declared backends: it will check the existing backend and update their state:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code22" lang="ts"></static-code-block>
            </div>
            <div>There are similar <kbd>init</kbd> functions that will in addition run <kbd>backendsForModelsInfo</kbd>
                to check the models's state.</div>
            <div>
                <static-code-block :hljs="hljs" :code="code23" lang="ts"></static-code-block>
            </div>
            <div class="pt-5">
                <a href="javascript:openLink('/the_brain/grammars')">Next: grammars</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { StaticCodeBlock } from "@docdundee/vue";
import { hljs } from "@/conf";

const code1 = `import { useLmBackend, useAgentBrain } from "@agent-smith/brain";

const localBackend = useLmBackend({
    name: "ollama",
    localLm: "ollama",
});

const remoteBackend = useLmBackend({
    name: "remote_backend",
    serverUrl: "https://myurl.com",
    apiKey: "xyz",
    providerType: "koboldcpp",
});

const brain = useAgentBrain([localBackend, browserBackend]);`;

const code2 = `brain.removeBackend("ollama") // backend.name`;

const code3 = `brain.addBackend(localBackend)`;

const code4 = `const backend = brain.backend("remote_backend")`;

const code4b = `const backends = brain.backends`;

const code5 = `import { useLmBackend, useLmExpert } from "@agent-smith/brain";

const backend = useLmBackend({
    name: "ollama",
    localLm: "ollama",
});

const expert = useLmExpert({
    name: "llama",
    backend: backend,
    template: "llama3",
    model: { name: "llama3.1:latest", ctx: 8192 },
});`;

const code6 = `import { useAgentBrain } from "@agent-smith/brain";

const brain = useAgentBrain([backend], [expert]);`;

const code7 = `brain.addExpert(backend);`

const code8 = `brain.removeExpert("llama") // expert.name;`;

const code9 = `const expert = brain.expert("llama");`;

const code10 = `const experts = brain.experts;`;

const code11 = `brain.setDefaultExpert("llama");
// or
brain.setDefaultExpert(expert)`;

const code12 = `const ex = brain.ex;`;

const code13 = `const usableExperts = brain.workingExperts();`;

const code14 = `const info = await brain.backendsForModelsInfo();
console.log("Models for a backend named ollama:", info.ollama);`;

const code15 = `const backendName = brain.getBackendForModel("llama3.1:latest")`;

const code16 = `const expert = brain.getExpertForModel("llama3.1:latest")`;

const code17 = `const expert = brain.getOrCreateExpertForModel("llama3.1:latest")`;

const code18 = `const res = await brain.think("my prompt...", {temperature: 0.5})`;

const code19 = `const res = await brain.thinkx("llama", "my prompt...")`;

const code20 = `const res = await brain.abortThinking();`;

const code21 = `const backends = await brain.discoverLocal();`;

const code22 = `const isUp = await brain.discover();`;

const code23 = `const isUp = await brain.initLocal();
const isUp = await brain.init();`;
</script>