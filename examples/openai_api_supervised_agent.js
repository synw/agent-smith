#!/usr/bin/env node
import { Agent } from "../packages/agent/dist/main.js";
import { Lm } from "@locallm/api";
import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const rl = createInterface({
    input,
    output
});

async function askUser(question) {
    const answer = await rl.question(question);
    return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

async function canExecuteTool(tool) {
    const msg = `Execute tool ${tool.name} with arguments ${Object.keys(tool.arguments).join(", ")}`;
    return await askUser(msg + ' (y/n): ');
}

let model;
const serverUrl = "http://localhost:8080/v1";
const apiKey = "";
const system = "You are a helpful touristic assistant";
const _prompt = `I am landing in Barcelona soon: I plan to reach my hotel and then go for outdoor sport. 
How are the conditions in the city?`;
//const _prompt = "What is the current weather in Barcelona?"

function run_get_current_weather(args) {
    console.log("Running the get_current_weather tool with args", args);
    return '{ "temp": 20.5, "weather": "rain" }'
}

function run_get_current_traffic(args) {
    console.log("Running the get_current_traffic tool with args", args);
    return '{ "trafic": "normal" }'
}

const get_current_weather = {
    "name": "get_current_weather",
    "description": "Get the current weather",
    "arguments": {
        "location": {
            "description": "The city and state, e.g. San Francisco, CA",
            "required": true
        }
    },
    execute: run_get_current_weather,
    canRun: canExecuteTool,
};

const get_current_traffic = {
    "name": "get_current_traffic",
    "description": "Get the current road traffic conditions",
    "arguments": {
        "location": {
            "description": "The city and state, e.g. San Francisco, CA",
            "required": true
        }
    },
    execute: run_get_current_traffic,
    canRun: canExecuteTool,
};

async function main() {
    const lm = new Lm({
        providerType: "openai",
        serverUrl: serverUrl,
        apiKey: apiKey,
        onToken: (t) => process.stdout.write(t),
    });
    const agent = new Agent(lm);
    await agent.run(_prompt,
        //inference params
        {
            model: model ?? "",
            temperature: 0.5,
            top_k: 40,
            top_p: 0.95,
            min_p: 0,
            max_tokens: 4096,
        },
        // query options
        {
            debug: false,
            verbose: true,
            system: system,
            tools: [get_current_weather, get_current_traffic]
        });
    console.log()
}

(async () => {
    await main();
})();


