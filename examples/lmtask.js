#!/usr/bin/env node
import { useLmTask } from "@agent-smith/lmtask";
import { useAgentBrain } from "@agent-smith/brain";

// Run an Ollama server with phi3.5:latest

const taskPath = "./sample/mytask.yml"

const brain = useAgentBrain();
await brain.initLocal();
brain.expert("ollama").setOnToken((t) => process.stdout.write(t));

const taskReader = useLmTask(brain);
// Read a task from a file
const { task, found } = taskReader.read(taskPath);
if (!found) {
    throw new Error("Task not found")
}
console.log(task);

// run the task
const lmTask = taskReader.init(taskPath);
await lmTask.run({
    prompt: "What are your favourite activities?",
    name: "Mr Brown", role: "marketing director",
    instructions: "Important: answer with a markdown bullet points list"
});