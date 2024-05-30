#!/usr/bin/env node
import { useAgentBrain, useLmExpert } from "@agent-smith/brain";

// run a local Ollama instance before running this example
// node  --loader ts-node/esm expert_for_model.ts

const ex = useLmExpert({
    name: "default",
    localLm: "ollama",
});
// add more experts ...

const brain = useAgentBrain([ex]);

async function main() {
    // auto discover loc
    console.log("Auto discovering brain backend ...");
    await brain.discover(true);
    await brain.expertsForModelsInfo()
    console.log("Experts for model:", brain.expertsForModels)
}

(async () => {
    await main();
})();
