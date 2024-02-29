<template>
  <div class="w-full">
    <div>
      <img src="/img/agentsmith.png" alt="" width="400" height="300" />
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

const side = `### What can Agent Smith do?
- **Interact with the user**: it provides some state management primitives to use in a UI
- **Think**: interact with some language model servers to perform inference queries`;

const code = `const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "mistral",
    onToken: (t) => process.stdout.write(t),
});
const brain = useAgentBrain([expert]);
const bob = useAgentSmith({
    name: "Bob",
    modules: [brain],
});
// auto discover if expert's inference servers are up
await bob.brain.discover();
// run an inference query
const _prompt = "list the planets of the solar sytem";
await bob.think(_prompt, { temperature: 0.2 });`;
</script>