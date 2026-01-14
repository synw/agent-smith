#!/usr/bin/env node
import { Lm } from "@locallm/api";
import { Agent } from "../packages/agent/dist/main.js";

const _prompt = "Give me a short list of the planets names in the solar system";
const _prompt2 = "Sort the planets by mass";
const model = {
    name: "qwen4b",
    //name: "oss20b"
};
const _template = "chatml";
//const _template = "gptoss";

async function main ()
{
    const lm = new Lm({
        providerType: "llamacpp",
        serverUrl: "http://localhost:8080",
        onToken: (t) => process.stdout.write(t),
    });
    const agent = new Agent(lm);
    const inferParams = {
        stream: true,
        model: model,
        temperature: 0.6,
        top_k: 40,
        top_p: 0.95,
        min_p: 0,
        max_tokens: 2048,
    };
    const options = { verbose: true };
    const result = await agent.run(_prompt,
        //inference params
        inferParams,
        // query options
        options,
        // manual prompt template
        _template
    );
    console.dir(result, { depth: 6 });
    //console.log("Thinking tokens:\n------------------------\n", agent.history[0].think);
    //console.log("Response tokens:\n------------------------\n", agent.history[0].assistant);
    const result2 = await agent.run(_prompt2,
        //inference params
        inferParams,
        // query options
        options,
        // manual prompt template
        _template
    );
    console.dir(result2, { depth: 6 });
    console.log("----------- history ------------");
    console.log(agent.history);
}

(async () =>
{
    await main();
})();
