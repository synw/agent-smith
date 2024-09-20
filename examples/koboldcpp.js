#!/usr/bin/env node
import { useAgentBrain, useLmExpert, useLmBackend } from "@agent-smith/brain";

//import { useLmBackend } from "../packages/brain/dist/backend.js";
//import { useAgentBrain } from "../packages/brain/dist/brain.js";
//import { useLmExpert } from "../packages/brain/dist/expert.js";

// run a local Koboldcpp instance before running this example
// set your template name below:

const templateName = "mistral";
const modelName = "mistral-7b-instruct-v0.2.Q5_K_M";
const prompt = "Give me a short list of the planets names in the solar system";

const backend = useLmBackend({
    name: "koboldcpp",
    localLm: "koboldcpp",
    onToken: (t) => process.stdout.write(t),
});

const ex = useLmExpert({
    name: "koboldcpp",
    backend: backend,
    template: templateName,
    model: { name: modelName, ctx: 2048 },
    onToken: (t) => process.stdout.write(t),
});
const brain = useAgentBrain([backend], [ex]);

async function main() {
    console.log("Bob can think:", brain.state.get().isOn);
    // auto discover loc
    console.log("Auto discovering brain backend ...");
    await brain.init();
    console.log("M", brain.ex.lm.model)
    brain.ex.checkStatus();
    if (brain.ex.state.get().status == "ready") {
        console.log("Ok\n")
    } else {
        console.warn(`Unfortunatly bob's brain is ${brain.ex.state.get().status}: please check the inference server`);
        return
    }
    // let's think
    const params = { temperature: 0.2 };
    console.log(prompt, "\n\nBob's answer:\n");
    const res = await brain.think(
        prompt,
        params,
    );
    console.log("\n\nDone");
    console.log(res.stats);

}

(async () => {
    await main();
})();
