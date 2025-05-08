#!/usr/bin/env node
import { default as fs } from "fs";
import { useAgentBrain } from "@agent-smith/brain";
import { LmTaskBuilder } from "@agent-smith/lmtask";
//import { LmTaskBuilder } from "../packages/lmtask/dist/main.js"

/* 
To use this as a cli task (will use the toolsList param from the toolsexample.yml task):

lm toolsexample "what is the weather in Monaco?"

Otherwise use as an independant lmtask as shown below, providing the functions to call
*/

// Run an Ollama server

//const model = { name: "granite3.3:2b", ctx: 2048, template: "granite-tools" };
const model = { name: "qwen3:4b", ctx: 2048, template: "chatml-tools" };
//const model = { name: "mistral-small:latest", ctx: 2048, template: "mistral-system-tools" };

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
    const taskPath = "./tasks/toolsexample.yml"

    const brain = useAgentBrain();
    await brain.initLocal();
    brain.backend("ollama").setOnToken((t) => process.stdout.write(t));
    const ymlTaskDef = fs.readFileSync(taskPath, 'utf8');
    const taskBuilder = new LmTaskBuilder(brain);
    // build the task
    const taskSpec = taskBuilder.readFromYaml(ymlTaskDef);
    taskSpec.tools = [weatherToolDef, trafficToolDef];
    const task = taskBuilder.init(taskSpec);
    console.log("Running task...", ymlTaskDef);
    // run the tasks
    const conf = {
        model: model,
        debug: true,
    };
    //const template = new PromptTemplate(model.template);
    const res = await task.run({
        prompt: _prompt,
    }, conf);
    console.log("\n\n----------- Template history:");
    console.log(res.template.history);
    console.log("\n\n----------- Next turn prompt template:");
    console.log(res.template.render());
}

(async () => {
    await main();
})();