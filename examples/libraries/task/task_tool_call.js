#!/usr/bin/env node
import { default as fs } from "fs";
import { Task } from "../../../packages/task/dist/main.js";
import { Agent, Lm } from "../../../packages/agent/dist/main.js";

const lm = new Lm({
    serverUrl: "http://localhost:8080/v1",
});
const model = "qwen4b";

const agent = new Agent({
    lm: lm,
    onToken: (t) => process.stdout.write(t),
    onThinkingToken: (t) => process.stdout.write(`\x1b[2m${t}\x1b[0m`),
    onToolCall: (tc) => console.log("TOOL CALL", tc),
});

const _prompt = `I am landing in Barcelona soon: I plan to reach my hotel and then go for outdoor sport. 
How are the conditions in the city?`;
//const _prompt = "What is the current weather in Barcelona?"

function get_current_weather(args) {
    console.log("Running the get_current_weather tool with args", args);
    return { "temp": 20.5, "weather": "rain" };
}

function get_current_traffic(args) {
    console.log("Running the get_current_traffic tool with args", args);
    return { "trafic": "normal" };
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
    const taskPath = "./toolsexample.yml";
    const ymlTaskDef = fs.readFileSync(taskPath, 'utf8');
    const task = Task.fromYaml(agent, ymlTaskDef);
    console.log("Running task...", ymlTaskDef);
    // run the task    
    const conf = {
        //debug: true,
        model: model,
        tools: [weatherToolDef, trafficToolDef],
        params: { stream: true },
    };
    const answer = await task.run({ prompt: _prompt }, conf);
}

(async () => {
    await main();
})();