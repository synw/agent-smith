#!/usr/bin/env node
import { Lm } from "@locallm/api";
import { Agent } from "../packages/agent/dist/main.js";

const _prompt = "Give me a short list of the planets names in the solar system";
const model = {
    //name: "qwen4b-thinking",
    name: "oss20b"
};
//const _template = "chatml"
const _template = "gptoss";

async function main()
{
    const lm = new Lm({
        providerType: "llamacpp",
        serverUrl: "http://localhost:8080",
        onToken: (t) => process.stdout.write(t),
    });
    const agent = new Agent(lm);
    const { result, template } = await agent.run(_prompt,
        //inference params
        {
            stream: true,
            model: model,
            temperature: 0.6,
            top_k: 40,
            top_p: 0.95,
            min_p: 0,
            max_tokens: 2048,
        },
        // query options
        {
            verbose: true,
        },
        // manual prompt template
        _template
    );
    console.dir(result, { depth: 6 });
    console.dir(template.history, { depth: 6 });
}

(async () =>
{
    await main();
})();
