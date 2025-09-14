#!/usr/bin/env node
import { default as fs } from "fs";
import { Task } from "../packages/task/dist/task.js";
import { Lm } from "@locallm/api";
import { Agent } from "../packages/agent/dist/agent.js";

// Run an Llama.cpp server
// llama-server -fa -m $1 --jinja --chat-template-file template.jinja -t 4 -c $2 --verbose-prompt
// template.jinja content:
// {{- messages[0].content -}}

const model = { name: "Qwen3-4B-Instruct-2507-UD-Q6_K_XL", ctx: 8192, template: "chatml-tools" };
const lm = new Lm({
    providerType: "llamacpp",
    serverUrl: "http://localhost:8080",
    onToken: (t) => process.stdout.write(t),
});
const agent = new Agent(lm);

const _prompt = `I am landing in Barcelona soon: I plan to reach my hotel and then go for outdoor sport. 
How are the conditions in the city?`;
//const _prompt = "What is the current weather in Barcelona?"

function get_current_weather(args) {
    console.log("Running the get_current_weather tool with args", args);
    return { "temp": 20.5, "weather": "rain" }
}

function get_current_traffic(args) {
    console.log("Running the get_current_traffic tool with args", args);
    return { "trafic": "normal" }
}

const weatherToolDef = {
    "name": "get_current_weather",
    "description": "Get the current weather",
    "arguments": {
        "location": {
            "description": "The city and state, e.g. San Francisco, CA"
        }
    },
    "execute": get_current_weather,
};
const trafficToolDef = {
    "name": "get_current_traffic",
    "description": "Get the current road traffic conditions",
    "arguments": {
        "location": {
            "description": "The city and state, e.g. San Francisco, CA"
        }
    },
    "execute": get_current_traffic,
};

async function main() {
    const taskPath = "./tasks/toolsexample.yml";
    const ymlTaskDef = fs.readFileSync(taskPath, 'utf8');
    const task = Task.fromYaml(agent, ymlTaskDef).addTools([weatherToolDef, trafficToolDef]);
    console.log("Running task...", ymlTaskDef);
    // run the task    
    const conf = {
        model: model,
        debug: true,
        inferParams: { stream: true },
    };
    const answer = await task.run({ prompt: _prompt }, conf);
    console.log("\n\n----------- Template history:");
    console.log(answer.template.history);
    console.log("\n\n----------- Next turn prompt template:");
    console.log(answer.template.render());
}

(async () => {
    await main();
})();