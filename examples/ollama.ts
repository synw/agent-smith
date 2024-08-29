#!/usr/bin/env node
import { useAgentBrain, useLmExpert } from "@agent-smith/brain";

// run a local Ollama instance before running this example
// node  --loader ts-node/esm ollama.ts

const model = "mistral:instruct";
const ctx = 8192;
const templateName = "mistral";
const prompt = "Give me a short list of the planets names in the solar system";

const ex = useLmExpert({
    name: "default",
    localLm: "ollama",
    templateName: templateName,
    onToken: (t: string) => process.stdout.write(t),
});
const brain = useAgentBrain([ex]);

async function main() {
    console.log("The agent can think:", brain.state.get().isOn);
    // auto discover loc
    console.log("Auto discovering brain backend ...");
    await brain.discover(true);
    if (brain.state.get().isOn) {
        console.log("Ok, the agent's brain is on, let's make him think\n")
    } else {
        console.warn("Unfortunatly the agent's brain is offline: please check the inference server");
        return
    }
    // load the model in Ollama
    await brain.ex.lm.loadModel(model, ctx)
    // let's think
    const params = { temperature: 0.2 };
    console.log(prompt, "\n\nAgent's answer:\n")
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
