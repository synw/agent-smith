#!/usr/bin/env node
import { useServer } from "../packages/apicli/dist/api.js";

/* Task:

name: infer
description: Run a raw inference query
prompt: |-
    {prompt}
ctx: 8192
model:
    name: qwen4b
    template: chatml
inferParams:
    top_k: 40
    top_p: 0.95
    min_p: 0.05
    temperature: 0.2
*/

async function main() {
    const api = useServer({
        apiKey: "30f224ea6b45af61356b8eb0bd84d2011f6f85dec6d49716c686cff66510efba",
        onToken: (t) => process.stdout.write(t),
        isVerbose: true,
    });
    await api.executeTask("infer", "Which is the largest planet of the solar system?", { debug: true });
}

(async () => { await main(); })();