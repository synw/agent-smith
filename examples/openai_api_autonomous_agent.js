#!/usr/bin/env node
import { Agent } from "../packages/agent/dist/main.js";
import { Lm } from "@locallm/api";

let model = "qwen4b-t";
const serverUrl = "http://localhost:8080/v1"; // Local Llama.cpp
const apiKey = "";
const system = "You are a helpful touristic assistant";
const _prompt = `I am landing in Barcelona in one hour: I plan to reach my hotel and then go for outdoor sport. 
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
    execute: run_get_current_weather
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
    execute: run_get_current_traffic
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
            temperature: 0.5,
            top_k: 40,
            top_p: 0.95,
            min_p: 0,
            max_tokens: 4096,
            model: { name: model }
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


