#!/usr/bin/env node
import { Agent } from "../packages/agent/dist/main.js";
import { Lm } from "@locallm/api";
import { PromptTemplate } from "modprompt";

let model; // qwen 3 4b
let template = new PromptTemplate("chatml-tools");
const serverUrl = "http://localhost:8080";
const apiKey = "";
const _prompt = `I am landing in Barcelona soon: I plan to reach my hotel and then go for outdoor sport. 
How are the conditions in the city? Use your tools to gather information about weather and traffic.`;
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
    /* this is a little help for Qwen 4b to format the tool calls correctly as the default
    system prompt is not that clear about it*/
    template.afterSystem(`\nExample of multiple tool calls:
<tool_call>
[{"name": "web_search", "arguments": {"query": "monuments of London"}}, {"name": "wikipedia_search", "arguments": {"location": "monuments of London"}}]
</tool_call>
`);
    const lm = new Lm({
        providerType: "llamacpp",
        serverUrl: serverUrl,
        apiKey: apiKey,
        onToken: (t) => process.stdout.write(t),
    });
    const agent = new Agent(lm);
    await agent.run(_prompt,
        //inference params
        {
            stream: true,
            model: model ?? "",
            temperature: 0.5,
            top_k: 40,
            top_p: 0.95,
            min_p: 0,
            max_tokens: 4096,
        },
        // query options
        {
            debug: true,
            //verbose: true,
            tools: [get_current_traffic, get_current_weather]
        },
        template,
    );
    console.log()
}

(async () => {
    await main();
})();


