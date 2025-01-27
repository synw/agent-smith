#!/usr/bin/env node
import { useServer } from "../packages/apicli/dist/api.js";

/* Infer task

name: infer
description: Run a raw inference query
prompt: |-
    {prompt}
model:
    name: llama3.1:latest
    ctx: 8192
    template: llama3
inferParams:
    temperature: 0.2
    max_tokens: 4096
*/

async function main() {
    const api = useServer({
        apiKey: "30f224ea6b45af61356b8eb0bd84d2011f6f85dec6d49716c686cff66510efba",
        onToken: (t) => process.stdout.write(t),
    });
    const abortController = new AbortController();
    setTimeout(() => {
        console.log("\n\n------------------------------ ABORT\n\n")
        abortController.abort()
    }, 5000);
    await api.executeTask(
        "infer",
        "Write a long story about a subject of your choice",
        {},
        abortController.signal
    )
}

(async () => { await main() })()