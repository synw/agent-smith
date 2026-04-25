#!/usr/bin/env node
import { default as fs } from "fs";
import { Agent, Lm } from "../../../packages/agent/dist/main.js";
import { Task } from "../../../packages/task/dist/main.js";

const lm = new Lm({
    serverUrl: "http://localhost:8080/v1",
});
const model = "qwen4b";

const agent = new Agent({
    lm: lm,
    onToken: (t) => process.stdout.write(t),
    onThinkingToken: (t) => process.stdout.write(`\x1b[2m${t}\x1b[0m`),
});

async function main() {
    const taskPath = "./variables.yml";
    const ymlTaskDef = fs.readFileSync(taskPath, 'utf8');
    const task = Task.fromYaml(agent, ymlTaskDef);
    //console.log("Running task...", task);
    // run the task    
    const conf = {
        debug: true,
        model: model,
        params: { stream: true, temperature: 0.8 },
    };
    const answer = await task.run({
        prompt: "What are your favourite activities?",
        name: "Mr Brown",
        role: "marketing director",
        instructions: "Answer with a markdown bullet points list"
    }, conf);
    console.log(answer.text);
}

(async () => {
    await main();
})();