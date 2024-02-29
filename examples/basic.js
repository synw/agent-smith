#!/usr/bin/env node
import { useAgentSmith } from "../packages/body/dist/api.es.js";
import { useAgentBrain } from "../packages/brain/dist/brain.js";
import { useLmExpert } from "../packages/brain/dist/lm.js"

// run a local Koboldcpp instance before running this example
// set your template name below:

const templateName = "mistral";
const prompt = "Give me a short list of the planets names in the solar system";

function initAgentBob() {
    const ex = useLmExpert({
        name: "default",
        localLm: "koboldcpp",
        templateName: templateName,
        onToken: (t) => process.stdout.write(t),
    });
    const brain = useAgentBrain([ex]);
    return useAgentSmith({
        name: "Bob",
        modules: [brain],
    });
}

async function main() {
    const bob = initAgentBob();
    console.log("Bob can think:", bob.brain.state.get().isOn);
    // auto discover loc
    console.log("Auto discovering brain backend ...");
    await bob.brain.discover(true);
    if (bob.brain.state.get().isOn) {
        console.log("Ok, bob's brain is on, let's make him think\n")
    } else {
        console.warn("Unfortunatly bob's brain is offline: please check the inference server");
        return
    }
    // let's think
    const params = { temperature: 0.2 };
    console.log(prompt, "\n\nBob's answer:\n")
    const res = await bob.think(
        prompt,
        params,
    );
    console.log("\n\nDone");
    //console.log(bob.brain.stream.value);
    //console.log(res);

}

(async () => {
    await main();
})();
