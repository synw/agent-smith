#!/usr/bin/env node
import { useServer } from "../packages/apicli/dist/api.js";

async function main() {
    const api = useServer({
        apiKey: "30f224ea6b45af61356b8eb0bd84d2011f6f85dec6d49716c686cff66510efba",
        onToken: (t) => process.stdout.write(t),
    });
    await api.executeWorkflow("q", ["Which is the largest planet of the solar system?"], { debug: true });
}

(async () => { await main(); })();