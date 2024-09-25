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
            an inference backend using a local Llama.cpp, Koboldcpp or Ollama or just the browser.
          </div>
          <div class="mt-5">
            <button v-if="brain.experts.length == 0" class="btn success" @click="isConfigModel = true">Configure an
              expert</button>
            <div v-else class="flex flex-col space-y-3">
              <div>
                Using a <span class="font-semibold">{{ brain.ex.backend.name }}</span> backend with
                model <span class="font-semibold">{{ brain.ex.backend.lm.model.name }}</span>
              </div>
            </div>
          </div>
          <div class="mt-5 flex flex-row space-x-2 items-center">
            <div>The agent config can be updated later using this icon</div>
            <div class="txt-light">
              <prompt-icon class="text-3xl"></prompt-icon>
            </div>
            <div>in the topbar</div>
          </div>
          <div class="mt-3">This interactive doc works with the <a
              href="https://huggingface.co/bartowski/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/Qwen2.5-0.5B-Instruct-Q5_K_M.gguf">Qwen
              2.5 0.5b q5k_m</a> model or another of
            your choice</div>
        </template>
        <template v-else>
          <div class="prosed">
            <h2>Agent config</h2>
          </div>
          <agent-conf @end="isConfigModel = false"></agent-conf>
        </template>
      </div>
    </div>
    <div class="ml-8">
      <render-md :hljs="hljs" :source="side"></render-md>
      <div class="flex flex-col mt-5">
        <div>Quick example:</div>
        <static-code-block :hljs="hljs" :code="code" lang="typescript"
          class="not-prose mt-5 max-w-screen-lg"></static-code-block>
      </div>
      <div>
        <button class="mt-5 btn" @click="router.push('/the_body/overview')">Next: the body: overview</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hljs } from "@/conf";
import { RenderMd } from "@docdundee/vue";
import { StaticCodeBlock } from "@docdundee/vue";
import PromptIcon from "@/widgets/PromptIcon.vue";
import AgentConf from '@/components/agentconf/AgentConf.vue';
import { ref } from "vue";
import { useRouter } from "vue-router";
import { brain } from "@/agent/agent";

const isConfigModel = ref(false);
const router = useRouter();

const side = `### What can Agent Smith do?

- **Interact**: the agent can perform interactions with the user and get input and feedback
- **Think**: interact with some language model servers to perform inference queries
- **Run jobs**: manage long running jobs with multiple tasks
- **Remember**: use it's transient or semantic memory to store data`;

const code = `const backend = useLmBackend({
    name: "koboldcpp",
    localLm: "koboldcpp",
    onToken: (t) => process.stdout.write(t),
});

const ex = useLmExpert({
    name: "koboldcpp",
    backend: backend,
    template: templateName,
    model: { name: modelName, ctx: 2048 },
});

const brain = useAgentBrain([backend], [ex]);

await brain.init();
brain.ex.checkStatus();
if (brain.ex.state.get().status == "ready") { 
  const params = { temperature: 0.2 };
    const res = await brain.think(
        prompt,
        params,
    );
    console.log(res.stats);
}`;
</script>