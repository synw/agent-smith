#!/usr/bin/env node
import { Lm } from "@locallm/api";
import { Agent } from "../packages/agent/dist/main.js";

const _prompt = "Give me a short list of the planets names in the solar system";
let template = new PromptTemplate("chatml");

async function main() {
    const lm = new Lm({
        providerType: "llamacpp",
        serverUrl: serverUrl,
        onToken: (t) => process.stdout.write(t),
    });
    const agent = new Agent(lm);
    await agent.run(_prompt,
        //inference params
        {
            stream: true,
            temperature: 0.6,
            top_k: 40,
            top_p: 0.95,
            min_p: 0,
            max_tokens: 4096,
        },
        // query options
        {
            verbose: true,
        },
        template,
    );
}

(async () => {
    await main();
})();
