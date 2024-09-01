#!/usr/bin/env node
//import { useLmTask } from "@agent-smith/lmtask";
import { default as fs } from "fs";
import { useAgentBrain } from "@agent-smith/brain";
import { LmTaskBuilder } from "../packages/lmtask/dist/task.js"

// Run an Ollama server with phi3.5:latest

const taskPath = "./sample/mytask.yml"

const brain = useAgentBrain();
await brain.initLocal();
brain.expert("ollama").setOnToken((t) => process.stdout.write(t));

const ymlTaskDef = fs.readFileSync(taskPath, 'utf8');
const taskBuilder = new LmTaskBuilder(brain);
// read the task spec
console.log(taskBuilder.readFromYaml(ymlTaskDef));
// build the task
const task = taskBuilder.fromYaml(ymlTaskDef);

// run the task
await task.run({
    prompt: "What are your favourite activities?",
    name: "Mr Brown", role: "marketing director",
    instructions: "Important: answer with a markdown bullet points list"
});