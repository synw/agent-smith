#!/usr/bin/env node
//import { useAgentSmith } from "@agent-smith/body";
//import { useAgentBrain, useLmExpert } from "@agent-smith/brain";
import { useAgentBrain } from "../packages/brain/src/brain.js";

// run a local Koboldcpp/Llama.cpp/Ollama instance before running this example
// set your template name below:

const templateName = "mistral";
const prompt = "Give me a short list of the planets names in the solar system";

async function initAgent() {
    const brain = useAgentBrain();
    await brain.discoverExperts();
    console.log("Experts:", brain.experts.map(e => e.name));
    console.log("Current expert:", brain.ex.name);
    brain.ex.setOnToken((t) => process.stdout.write(t));
    brain.ex.setTemplate(templateName);
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
