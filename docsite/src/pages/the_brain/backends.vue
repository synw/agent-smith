<template>
    <div>
        <div class="prosed">
            <h1>Backends</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>The brain module is usable independently
                of the body.It manages connections to inference servers using backends.</div>
            <div>First initialize a brain instance:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code0" lang="ts"></static-code-block>
            </div>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>Backends can be a local or remote inference server or a browser for small models.</div>
        </div>
        <div class="prosed">
            <h2>Initialize a backend</h2>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>Supported local and remote backends: Llama.cpp, Koboldcpp, Ollama.</div>
            <div>Simple local backend:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code1" lang="ts"></static-code-block>
            </div>
            <div>The <kbd>localLm</kbd> parameter is used to autoconfigure the local server. Possible values:
                <code>llamacpp, koboldcpp, ollama, browser</code>
            </div>
            <div>Remote backend:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code2" lang="ts"></static-code-block>
            </div>
            <div>Browser backend:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code3" lang="ts"></static-code-block>
            </div>
            <div>Once created the backends must be attached to the brain. It is possible to do it at
                initialization time or later. Initialize a brain with some backends:
            </div>
            <div>
                <static-code-block :hljs="hljs" :code="code4" lang="ts"></static-code-block>
            </div>
            <div>Add a backend to the brain instance:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code5" lang="ts"></static-code-block>
            </div>
            <div>Remove a backend from the brain instance:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code6" lang="ts"></static-code-block>
            </div>
        </div>
        <div class="prosed">
            <h2>Options</h2>
            <h3>On token callback</h3>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>The <kbd>onToken</kbd> callback will be called each time a token is streamed. To set it
                at initialization time:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code7" lang="ts"></static-code-block>
            </div>
            <div>To set it at anytime:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code8" lang="ts"></static-code-block>
            </div>
        </div>
        <div class="prosed">
            <h3>On start emit callback</h3>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>The <kbd>onStartEmit</kbd> callback is called when the model emits the first token. It can
                be used to know when the model is ingesting a prompt and when it is emitting tokens. To set it
                at initialization time:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code9" lang="ts"></static-code-block>
            </div>
            <div>To set it at anytime:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code10" lang="ts"></static-code-block>
            </div>
        </div>
        <div class="prosed">
            <h2>State</h2>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>A state is available to check if the backend is up:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code11" lang="ts"></static-code-block>
            </div>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>To check if the backend is up use <kbd>probe</kbd>:</div>
            <div>
                <static-code-block :hljs="hljs" :code="code12" lang="ts"></static-code-block>
            </div>
            <div>This will modify the state accordingly and update the backend's models info.</div>
        </div>
        <div class="pt-5">
            <a href="javascript:openLink('/the_brain/experts')">Next: experts</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { StaticCodeBlock } from "@docdundee/vue";
import { hljs } from "@/conf";

const code0 = `import { useAgentBrain } from "@agent-smith/brain";

const brain = useAgentBrain();`;

const code1 = `import { useLmBackend } from "@agent-smith/brain";

const localBackend = useLmBackend({
    name: "ollama",
    localLm: "ollama",
});`;

const code2 = `const remoteBackend = useLmBackend({
    name: "remote_backend",
    serverUrl: "https://myurl.com",
    apiKey: "xyz",
    providerType: "koboldcpp",
});`;

const code3 = `const browserBackend = useLmBackend({
    name: "browser",
    localLm: "browser",
});`;

const code4 = `const brain = useAgentBrain([localBackend, browserBackend]);`;

const code5 = `brain.addBackend(remoteBackend)`;

const code6 = `brain.removeBackend("remote_backend") // backend.name`;

const code7 = `const backend = useLmBackend({
    name: "ollama",
    localLm: "ollama",
    onToken: (t) => process.stdout.write(t),
});`

const code8 = `backend.setOnToken((t: string) => console.log("Incoming token:", t))`;

const code9 = `const backend = useLmBackend({
    name: "ollama",
    localLm: "ollama",
    onStartEmit: () => console.log("Start streaming"),
});`

const code10 = `backend.setOnStartEmit(() => console.log("State: emiting tokens"))`;

const code11 = `console.log("Is the backend up:", backend.state.get().isUp)`;

const code12 = `const isUp = await backend.probe();`
</script>