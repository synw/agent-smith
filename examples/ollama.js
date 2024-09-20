#!/usr/bin/env node
import { useLmBackend, useLmExpert } from "@agent-smith/brain";
//import { useLmBackend } from "../packages/brain/dist/backend.js";
//import { useLmExpert } from "../packages/brain/dist/expert.js";

// run a local Ollama instance before running this example

const model = "llama3.1:latest";
const ctx = 8192;
const templateName = "llama3";
const prompt = "Give me a short list of the planets names in the solar system";

const backend = useLmBackend({
    name: "ollama",
    localLm: "ollama",
    onToken: (t) => process.stdout.write(t),
});

const ex = useLmExpert({
    name: "default",
    backend: backend,
    template: templateName,
    model: { name: model, ctx: ctx },
});

async function main() {
    // check if the backend is up
    await ex.backend.probe();
    // check expert status: unavailable, available (the model is not loaded), ready
    ex.checkStatus();
    const status = ex.state.get().status;
    if (status == "ready") {
        console.log("Ok, the agent's brain is on, let's make him think\n")
    } else if (status == "available") {
        console.warn(`Loading model ...`);
        // load the model in Ollama
        await ex.loadModel()
    } else {
        console.warn(`Unfortunatly the agent's brain is ${status}: please check the inference server`);
        return
    }
    // let's think
    const params = { temperature: 0.2, min_p: 0.05 };
    const res = await ex.think(
        prompt,
        params,
    );
    console.log("\n\nDone");
    console.log(res.stats);

}

(async () => {
    await main();
})();
