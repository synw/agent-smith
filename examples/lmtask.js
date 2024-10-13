#!/usr/bin/env node
//import { useLmTask } from "@agent-smith/lmtask";
import { default as fs } from "fs";
import { useAgentBrain } from "@agent-smith/brain";
import { LmTaskBuilder } from "@agent-smith/lmtask";
//import { useAgentBrain } from "../packages/brain/dist/brain.js";
//import { LmTaskBuilder } from "../packages/lmtask/dist/task.js"

// Run an Ollama server

const model = "llama3.1:latest";
const template = "llama3";

async function main() {
    const taskPath = "./sample/mytask.yml"

    const brain = useAgentBrain();
    await brain.initLocal();
    brain.backend("ollama").setOnToken((t) => process.stdout.write(t));
    const ex = brain.getOrCreateExpertForModel(model, template);
    if (!ex) {
        console.error("No backend found for model")
    }
    const ymlTaskDef = fs.readFileSync(taskPath, 'utf8');
    const taskBuilder = new LmTaskBuilder(brain);
    // build the task
    const task = taskBuilder.fromYaml(ymlTaskDef);
    console.log("Running task...", task.name);
    // run the task    
    const conf = {
        expert: ex,
        model: model,
        template: template,
        debug: true,
    };
    await task.run({
        prompt: "What are your favourite activities?",
        name: "Mr Brown", role: "marketing director",
        instructions: "Important: answer with a markdown bullet points list"
    }, conf);
}

(async () => {
    await main();
})();