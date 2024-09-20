#!/usr/bin/env node
import { useAgentBrain, useLmBackend } from "@agent-smith/brain";
//import { useLmBackend } from "../packages/brain/dist/backend.js";
//import { useAgentBrain } from "../packages/brain/dist/brain.js";

// run a local Ollama instance before running this example

const brain = useAgentBrain();

async function main() {
    // auto discover loc
    console.log("Auto discovering brain backends ...");
    await brain.initLocal(true, true);
    console.log("Backends:", brain.backends.map(b => b.name));
    //const info = await brain.backendsForModelsInfo();
    console.log("Backends for model:", brain.backendsForModels)
}

(async () => {
    await main();
})();
