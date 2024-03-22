<template>
  <div class="w-full">
    <div class="flex flex-row">
      <div class="w-[400px] h-[300px]">
        <img src="/img/agentsmith.png" alt="" width="400" height="300" />
      </div>
      <div class="mt-5 flex flex-col w-[620px]">
        <template v-if="!isConfigModel">
          <div class="prosed">
            <h2>Interactive doc config</h2>
          </div>
          <div>Agent Smith's documentation has interactive examples. To run them configure
            a local inference server using Llama.cpp, Koboldcpp or Ollama.
          </div>
          <div class="mt-8">
            <button class="btn success" @click="isConfigModel = true">Configure an inference server</button>
          </div>
          <div class="mt-5 flex flex-row space-x-2 items-center">
            <div>Or you can do it later using this icon</div>
            <div class="txt-light">
              <prompt-icon class="text-3xl"></prompt-icon>
            </div>
            <div>in the topbar</div>
          </div>
          <div class="mt-3">This demo works with the <a
              href="https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF">Tinyllama</a> model or another of
            your choice</div>
        </template>
        <template v-else>
          <div class="prosed">
            <h2>Inference server config</h2>
          </div>
          <model-conf></model-conf>
        </template>
      </div>
    </div>
    <div class="ml-8">
      <render-md :hljs="hljs" :source="side"></render-md>
      <div class="flex flex-col mt-5">
        <div>Quick Nodejs example:</div>
        <static-code-block :hljs="hljs" :code="code" lang="typescript"
          class="not-prose mt-5 max-w-screen-lg"></static-code-block>
      </div>
      <div>
        <button class="mt-5 btn" @click="$router.push('/the_body/overview')">Next: the body: overview</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hljs } from "@/conf";
import { RenderMd } from "@docdundee/vue";
import { StaticCodeBlock } from "@docdundee/vue";
import PromptIcon from "@/widgets/PromptIcon.vue";
import ModelConf from "@/agent/widgets/ModelConf.vue";
import { ref } from "vue";

const isConfigModel = ref(false);

const side = `### What can Agent Smith do?

- **Interact**: the agent can perform interactions with the user and get input and feedback
- **Think**: interact with some language model servers to perform inference queries
- **Run jobs**: manage long running jobs with multiple tasks
- **Remember**: use it's transient or semantic memory to store data`;

const code = `const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "mistral",
    onToken: (t) => process.stdout.write(t),
});

const bob = useAgentSmith({
    name: "Bob",
    brain: useAgentBrain([expert]),
});

// auto discover if expert's inference servers are up
const isUp = await bob.brain.discover();
if (isUp) {
  // run an inference query
  const _prompt = "list the planets of the solar sytem";
  await bob.brain.think(_prompt, { temperature: 0.2 });
}`;
</script>