#!/usr/bin/env node
import { Agent, Lm } from "../../../packages/agent/dist/main.js";

let model = "qwen4b";
const serverUrl = "http://localhost:8080/v1"; // Local Llama.cpp
const apiKey = "";
const system = "You are a helpful touristic assistant";
const _prompt = `I am landing in Barcelona in one hour: I plan to reach my hotel and then go for outdoor sport. 
How are the conditions in the city?`;
//const _prompt = "What is the current weather in Barcelona?"

const onToolCall = (tc) => console.log("TOOL CALL", tc);
const onToolCallEnd = (id, tce) => console.log("TOOL CALL END", id);
const onToolCallInProgress = (tcs) => {
    let i = 0;
    tcs.forEach(tc => {
        if (Object.keys(tc.arguments).length > 0) {
            console.log("Tool call spec completed", i, tc.name, tc.arguments);
        } else {
            console.log("Tool call in progress", i, tc.name);
        }
        ++i;
    });
};

function run_get_current_weather(args) {
    console.log("Running the get_current_weather tool with args", args);
    return '{ "temp": 20.5, "weather": "rain" }';
}

function run_get_current_traffic(args) {
    console.log("Running the get_current_traffic tool with args", args);
    return '{ "trafic": "normal" }';
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
        serverUrl: serverUrl,
        apiKey: apiKey,
    });
    const agent = new Agent({
        lm: lm,
        onToken: (t) => process.stdout.write(t),
        onToolCallInProgress: onToolCallInProgress,
        onToolCall: onToolCall,
        onToolCallEnd: onToolCallEnd,
    });
    await agent.run(_prompt,
        {
            //debug: false,
            verbose: true,
            model: model,
            system: system,
            tools: [get_current_weather, get_current_traffic],
            params: {
                //inference params
                temperature: 0.5,
                top_k: 40,
                top_p: 0.95,
                min_p: 0,
                max_tokens: 4096,
            }
        });
    console.log();
}

(async () => {
    await main();
})();


