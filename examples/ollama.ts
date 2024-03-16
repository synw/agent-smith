#!/usr/bin/env node
import { useAgentSmith } from "@agent-smith/body";
import { useAgentBrain, useLmExpert } from "@agent-smith/brain";
/*import { useAgentSmith } from "../packages/body/dist/api.es.js";
import { useAgentBrain } from "../packages/brain/dist/brain.js";
import { useLmExpert } from "../packages/brain/dist/lm.js";*/

// run a local Koboldcpp instance before running this example
// set your template name below:

const templateName = "mistral";
const prompt = "Give me a short list of the planets names in the solar system";

const ex = useLmExpert({
    name: "default",
    localLm: "ollama",
    templateName: templateName,
    onToken: (t: string) => process.stdout.write(t),
});
const brain = useAgentBrain([ex]);
const agent = useAgentSmith({
    name: "Bob",
    brain: brain,
});

async function main() {
    console.log("Bob can think:", brain.state.get().isOn);
    // auto discover loc
    console.log("Auto discovering brain backend ...");
    await brain.discover(true);
    if (brain.state.get().isOn) {
        console.log("Ok, bob's brain is on, let's make him think\n")
    } else {
        console.warn("Unfortunatly bob's brain is offline: please check the inference server");
        return
    }
    // load the model in Ollama
    await brain.ex.lm.loadModel("mistral:instruct", 8192)
    // let's think
    const params = { temperature: 0.2 };
    console.log(prompt, "\n\nBob's answer:\n")
    const res = await brain.think(
        prompt,
        params,
    );
    console.log("\n\nDone");
    //console.log(res);

}

(async () => {
    await main();
})();
