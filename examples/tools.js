#!/usr/bin/env node
import { default as fs } from "fs";
import { PromptTemplate } from "modprompt";
import { useAgentBrain } from "@agent-smith/brain";
//import { LmTaskBuilder } from "@agent-smith/lmtask";
//import { useAgentBrain } from "../packages/brain/dist/brain.js";
import { LmTaskBuilder } from "../packages/lmtask/dist/main.js"

// Run an Ollama server

const model = { name: "granite3.3:2b", ctx: 2048, template: "granite-tools" };
//const model = { name: "qwen2.5:3b", ctx: 2048, template: "chatml-tools" };


function get_current_weather(args) {
    console.log("Running the get_current_weather tool with args", args);
    return '{“temp”: 20.5, “unit”: “C”}'
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


async function main() {
    const taskPath = "./tasks/toolsexample.yml"

    const brain = useAgentBrain();
    await brain.initLocal();
    brain.backend("ollama").setOnToken((t) => process.stdout.write(t));
    const ymlTaskDef = fs.readFileSync(taskPath, 'utf8');
    const taskBuilder = new LmTaskBuilder(brain);
    // build the task
    const taskSpec = taskBuilder.readFromYaml(ymlTaskDef);
    taskSpec.tools = [weatherToolDef];
    const task = taskBuilder.init(taskSpec);
    console.log("Running task...", ymlTaskDef);
    // run the tasks
    const conf = {
        model: model,
        debug: true,
    };
    const template = new PromptTemplate(model.template);
    const res = await task.run({
        prompt: "What is the current weather in Barcelona?",
    }, conf);
    const { isToolCall, toolsCall, error } = template.processAnswer(res.text);
    if (error) {
        throw new Error(`Error processing tool call answer:\n, ${answer}`);
    }
    if (!isToolCall) {
        return
    }
    let toolResponse = {};
    toolsCall.forEach((tc) => {
        console.log("Executing tool call:", tc);
        if (tc.name == "weather") {
            toolResponse = get_current_weather(tc.arguments)
        }
    });
    console.log("Tools response", toolResponse);
    //console.log("\nProcessed answer", isToolCall, toolsCall, error);
    //return
    template.pushToHistory({
        user: prompt,
        assistant: res.text,
        tool: toolResponse.toString(),
    });
    console.log("\n----------- Turn 2 prompt:");
    const _nextPrompt = template.render();
    console.log(_nextPrompt);
    console.log("------------\n");
    await lm.infer(_nextPrompt, {
        stream: true,
        temperature: 0.1,
        max_tokens: 1024,
        extra: {
            raw: true
        }
    });
    console.log()
}

(async () => {
    await main();
})();