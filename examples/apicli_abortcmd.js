#!/usr/bin/env node
import { useServer } from "../packages/apicli/dist/api.js";

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
    await api.executeCmd(
        "infer",
        ["Describe the Jupiter moons and their characteristics"],
        abortController.signal
    )
}

(async () => { await main() })()