<template>
  <div class="w-full">
    <div class="flex flex-row">
      <div class="w-[400px] h-[300px]">
        <img src="/img/agentsmith.png" alt="" width="400" height="300" />
      </div>
      <div class="mt-12 flex flex-col w-[620px]">
        <div class="text-2xl">What Agent Smith can do:</div>
        <ul class="mt-8 list-disc space-y-2">
          <li><b>Think</b>: use language model servers to perform inference queries</li>
          <li><b>Work</b>: manage long running workflows with multiple tasks, using tools</li>
          <li><b>Remember</b>: use semantic memory to store data</li>
          <li><b>Interact</b>: perform interactions with the user</li>
        </ul>
      </div>
    </div>
    <div class="ml-8">
      <div class="flex flex-col mt-5">
        <div>Quick example:</div>
        <static-code-block :hljs="hljs" :code="code" lang="typescript"
          class="not-prose mt-5 max-w-screen-lg"></static-code-block>
      </div>
      <div>
        <button class="mt-5 btn" @click="router.push('/terminal_client/install')">Next: terminal client</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hljs } from "@/conf";
import { StaticCodeBlock } from "@docdundee/vue";
import { useRouter } from "vue-router";

const router = useRouter();

const code = `import { Agent } from "@agent-smith/agent";
import { Lm } from "@locallm/api";

const lm = new Lm({
    providerType: "openai",
    serverUrl: serverUrl,
    apiKey: apiKey,
    onToken: (t) => process.stdout.write(t),
});

const agent = new Agent(lm);
await agent.run(_prompt,
    //inference params
    {
        temperature: 0.5,
        top_k: 40,
        top_p: 0.95,
        min_p: 0,
        max_tokens: 4096,
        model: { name: "qwen4b" }
    },
    // query options
    {
        verbose: true,
        system: "You are a helpful assistant",
    });`;
</script>