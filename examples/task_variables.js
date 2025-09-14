#!/usr/bin/env node
import { default as fs } from "fs";
import { Lm } from "@locallm/api";
import { Agent } from "../packages/agent/dist/agent.js";
import { Task } from "../packages/task/dist/task.js";

// Run an Llama.cpp server
// llama-server -fa -m Qwen3-4B-Instruct-2507-UD-Q6_K_XL.gguf --jinja --chat-template-file template.jinja -c 8192 --verbose-prompt
// template.jinja content:
// {{- messages[0].content -}}

const lm = new Lm({
    providerType: "llamacpp",
    serverUrl: "http://localhost:8080",
    onToken: (t) => process.stdout.write(t),
});
const agent = new Agent(lm);

async function main() {
    const taskPath = "./tasks/variables.yml";
    const ymlTaskDef = fs.readFileSync(taskPath, 'utf8');
    const task = new Task(agent, ymlTaskDef);
    console.log("Running task...", ymlTaskDef);
    // run the task    
    const conf = {
        debug: true,
        modelname: "gemma3",
        inferParams: { stream: true },
    };
    const answer = await task.run({
        prompt: "What are your favourite activities?",
        name: "Mr Brown",
        role: "marketing director",
        instructions: "Answer with a markdown bullet points list"
    }, conf);
    console.log(answer);
}

(async () => {
    await main();
})();