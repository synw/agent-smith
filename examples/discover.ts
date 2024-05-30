#!/usr/bin/env node
import { useAgentBrain } from "@agent-smith/brain";

// run a local Koboldcpp/Llama.cpp/Ollama instance before running this example
// node  --loader ts-node/esm discover.ts

const templateName = "mistral";
const model = "mistral:instruct"; // for Ollama
const prompt = "Give me a short list of the planets names in the solar system";

async function initAgent() {
    const brain = useAgentBrain();
    await brain.discoverLocal();
    console.log("Experts:", brain.experts.map(e => e.name));
    console.log("Current expert:", brain.ex.name);
    brain.ex.setOnToken((t) => process.stdout.write(t));
    brain.ex.setTemplate(templateName);
    // load model if relevant
    if (brain.ex.lm.providerType == "ollama") {
        await brain.ex.lm.loadModel(model, 8192)
    }
    // prompt
    const params = { temperature: 0.2 };
    console.log(prompt, "\n\nAnswer:\n")
    const res = await brain.think(
        prompt,
        params,
    );
    console.log("\n\nDone");
    console.log(res);
}

(async () => {
    await initAgent();
})();
