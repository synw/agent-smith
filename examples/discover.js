#!/usr/bin/env node
import { useAgentBrain, useLmExpert } from "@agent-smith/brain";
//import { useAgentBrain } from "../packages/brain/dist/brain.js";
//import { useLmExpert } from "../packages/brain/dist/expert.js";

// run a local Koboldcpp/Llama.cpp/Ollama instance before running this example

const templateName = "mistral";
const model = "mistral:instruct"; // for Ollama
const prompt = "Give me a short list of the planets names in the solar system";

async function initAgent() {
    const brain = useAgentBrain();
    const backends = await brain.discoverLocal();
    console.log("Backends:", brain.backends.map(e => e.name));
    brain.addExpert(useLmExpert({
        name: "myexpert",
        backend: backends[0],
        template: templateName,
        model: { name: model, ctx: 2048 }
    }));
    brain.ex.checkStatus();
    console.log("Experts:", brain.experts.map(e => e.name));
    brain.ex.backend.setOnToken((t) => process.stdout.write(t));
    // load model if relevant
    console.log("Expert status:", brain.ex.state.get().status);
    if (brain.ex.state.get().status == "available") {
        console.log("Loading model");
        await brain.ex.loadModel(model, 2048)
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
