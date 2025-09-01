#!/usr/bin/env node
import { default as fs } from "fs";
import { Task } from "../packages/task/dist/task.js";
import { Lm } from "@locallm/api";

// Run an Llama.cpp server
// llama-server -fa -m $1 --jinja --chat-template-file template.jinja -t 4 -c $2 --verbose-prompt
// template.jinja content:
// {{- messages[0].content -}}

const model = {
    name: "gemma-3n-E4B-it-Q4_K_M",
    ctx: 8192,
    template: "gemma"
};
const lm = new Lm({
    providerType: "llamacpp",
    serverUrl: "http://localhost:8080",
    onToken: (t) => process.stdout.write(t),
});

async function main() {
    const taskPath = "./tasks/mytask.yml";
    const ymlTaskDef = fs.readFileSync(taskPath, 'utf8');
    const task = new Task(lm, ymlTaskDef);
    console.log("Running task...", ymlTaskDef);
    // run the task    
    const conf = {
        model: model,
        debug: true,
        inferParams: { stream: true },
    };
    const answer = await task.run({
        prompt: "What are your favourite activities?",
        name: "Mr Brown", role: "marketing director",
        instructions: "Important: answer with a markdown bullet points list"
    }, conf);
    console.log(answer);
}

(async () => {
    await main();
})();