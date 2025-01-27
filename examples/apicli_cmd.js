#!/usr/bin/env node
import { useServer } from "../packages/apicli/dist/api.js";

/* Task:

name: infer
description: Run a raw inference query
prompt: |-
    {prompt}
model:
    name: llama3.1:latest
    ctx: 8192
    template: llama3
inferParams:
    top_k: 1
    top_p: 0
    min_p: 0.05
    temperature: 0.2
    max_tokens: 4096
*/

async function main() {
    const api = useServer({
        apiKey: "30f224ea6b45af61356b8eb0bd84d2011f6f85dec6d49716c686cff66510efba",
        onToken: (t) => process.stdout.write(t),
    });
    await api.executeCmd("infer", ["Which is the largest planet of the solar system?"])
}

(async () => { await main() })()