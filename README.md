# Agent Smith

An api to create local first human friendly agents in the browser or Nodejs

![Agent Smith](docsite/public/img/agentsmith.png)

<details>
<summary>:books: Read the <a href="https://synw.github.io/agent-smith">documentation</a></summary>

 - [Libraries](https://synw.github.io/agent-smith/libraries)
     - [Agent](https://synw.github.io/agent-smith/libraries/agent)
        - [Get started](https://synw.github.io/agent-smith/libraries/agent/get_started)
        - [Tools](https://synw.github.io/agent-smith/libraries/agent/tools)
        - [Templates](https://synw.github.io/agent-smith/libraries/agent/templates)
        - [Supervision](https://synw.github.io/agent-smith/libraries/agent/supervision)
     - [Task](https://synw.github.io/agent-smith/libraries/task)
        - [Get started](https://synw.github.io/agent-smith/libraries/task/get_started)
        - [Specification](https://synw.github.io/agent-smith/libraries/task/specification)
        - [Use tasks](https://synw.github.io/agent-smith/libraries/task/use_tasks)
        - [Models](https://synw.github.io/agent-smith/libraries/task/models)
        - [Templates](https://synw.github.io/agent-smith/libraries/task/templates)
        - [Variables](https://synw.github.io/agent-smith/libraries/task/variables)
        - [Tools](https://synw.github.io/agent-smith/libraries/task/tools)
        - [Fragments](https://synw.github.io/agent-smith/libraries/task/fragments)
     - [Transient memory](https://synw.github.io/agent-smith/libraries/transient_memory)
        - [Get started](https://synw.github.io/agent-smith/libraries/transient_memory/get_started)
        - [Usage](https://synw.github.io/agent-smith/libraries/transient_memory/usage)
        - [Api](https://synw.github.io/agent-smith/libraries/transient_memory/api)
     - [Semantic memory](https://synw.github.io/agent-smith/libraries/semantic_memory)
        - [Get started](https://synw.github.io/agent-smith/libraries/semantic_memory/get_started)
        - [Initialize](https://synw.github.io/agent-smith/libraries/semantic_memory/initialize)
        - [Write operations](https://synw.github.io/agent-smith/libraries/semantic_memory/write_operations)
        - [Read operations](https://synw.github.io/agent-smith/libraries/semantic_memory/read_operations)
 - [Terminal client](https://synw.github.io/agent-smith/terminal_client)
    - [Install](https://synw.github.io/agent-smith/terminal_client/install)
    - [Overview](https://synw.github.io/agent-smith/terminal_client/overview)
    - [Config](https://synw.github.io/agent-smith/terminal_client/config)
    - [Tasks](https://synw.github.io/agent-smith/terminal_client/tasks)
    - [Actions](https://synw.github.io/agent-smith/terminal_client/actions)
    - [Workflows](https://synw.github.io/agent-smith/terminal_client/workflows)
    - [Commands](https://synw.github.io/agent-smith/terminal_client/commands)
     - [Agents](https://synw.github.io/agent-smith/terminal_client/agents)
        - [Overview](https://synw.github.io/agent-smith/terminal_client/agents/overview)
        - [Tools call](https://synw.github.io/agent-smith/terminal_client/agents/tools_call)
        - [Mcp](https://synw.github.io/agent-smith/terminal_client/agents/mcp)
        - [Subagents](https://synw.github.io/agent-smith/terminal_client/agents/subagents)
        - [Tools routing](https://synw.github.io/agent-smith/terminal_client/agents/tools_routing)
 - [Plugins](https://synw.github.io/agent-smith/plugins)
    - [Overview](https://synw.github.io/agent-smith/plugins/overview)
    - [Inference](https://synw.github.io/agent-smith/plugins/inference)
    - [Vision](https://synw.github.io/agent-smith/plugins/vision)
    - [Filesystem](https://synw.github.io/agent-smith/plugins/filesystem)
     - [Code](https://synw.github.io/agent-smith/plugins/code)
        - [Git](https://synw.github.io/agent-smith/plugins/code/git)
 - [Server](https://synw.github.io/agent-smith/server)
    - [Get started](https://synw.github.io/agent-smith/server/get_started)
    - [Api](https://synw.github.io/agent-smith/server/api)

</details>

Check the :computer: [examples](examples)

## What is an agent?

An agent is a language model that can take decisions. It can:

- **Think**: use language model servers to perform inference queries
- **Work**: manage long running workflows with multiple tasks, using tools
- **Remember**: use semantic memory to store data
- **Interact**: perform interactions with the user

## Packages

| Version | Name | Description | Nodejs | Browser |
| --- | --- | --- | --- | --- |
| [![pub package](https://img.shields.io/npm/v/@agent-smith/cli)](https://www.npmjs.com/package/@agent-smith/cli) | [@agent-smith/cli](https://github.com/synw/agent-smith/tree/main/packages/cli) | Terminal client | :white_check_mark: | :x:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/agent)](https://www.npmjs.com/package/@agent-smith/agent) | [@agent-smith/agent](https://github.com/synw/agent-smith/tree/main/packages/agent) | Agent | :white_check_mark: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/task)](https://www.npmjs.com/package/@agent-smith/task) | [@agent-smith/task](https://github.com/synw/agent-smith/tree/main/packages/task) | Task | :white_check_mark: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/smem)](https://www.npmjs.com/package/@agent-smith/smem) | [@agent-smith/smem](https://github.com/synw/agent-smith/tree/main/packages/smem) | Semantic memory | :white_check_mark: | :x:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/tfm)](https://www.npmjs.com/package/@agent-smith/tfm) | [@agent-smith/tfm](https://github.com/synw/agent-smith/tree/main/packages/tfm) | Templates for models | :white_check_mark: | :white_check_mark:

[Terminal client plugins](https://github.com/synw/agent-smith-plugins)

## Philosophy

- **Composable**: the packages have limited responsibilities and can work together
- **Declarative**: focus on the business logic by expressing features simply
- **Explicit**: keep it simple and under user control: no hidden magic

## Requirements

Supported inference servers:

- [Llama.cpp](https://github.com/ggerganov/llama.cpp)
- [Koboldcpp](https://github.com/LostRuins/koboldcpp)
- [Ollama](https://github.com/ollama/ollama)
- Any server that supports an Openai compatible api

## Example

### Terminal client

Simple inference query (using the [inference](https://synw.github.io/agent-smith/plugins/inference) plugin):

```bash
lm q list the planets of the solar system
```

Compare images (using the [vision](https://synw.github.io/agent-smith/plugins/vision) plugin):

```bash
lm vision img1.jpg img2.jpg "Compare the images"
```

Generate a commit message in a git repository (using the [git](https://synw.github.io/agent-smith/plugins/code/git) plugin):

```bash
lm commit
```

## Terminal client plugins

Plugins for the terminal client are available: [terminal client plugins](https://github.com/synw/agent-smith-plugins)

## Nodejs example: using an agent with local tools

```js
import { Agent } from "@agent-smith/agent";
import { Lm } from "@locallm/api";

let model;
const serverUrl = "http://localhost:8080/v1"; // Local Llama.cpp
const apiKey = "";
const system = "You are a helpful touristic assistant";
const _prompt = `I am landing in Barcelona in one hour: I plan to reach my hotel and then go for outdoor sport. 
How are the conditions in the city?`;

function run_get_current_weather(args) {
    console.log("Running the get_current_weather tool with args", args);
    return '{ "temp": 20.5, "weather": "rain" }'
}

function run_get_current_traffic(args) {
    console.log("Running the get_current_traffic tool with args", args);
    return '{ "trafic": "normal" }'
}

const get_current_weather = {
    "name": "get_current_weather",
    "description": "Get the current weather",
    "arguments": {
        "location": {
            "description": "The city and state, e.g. San Francisco, CA",
            "required": true
        }
    },
    execute: run_get_current_weather
};

const get_current_traffic = {
    "name": "get_current_traffic",
    "description": "Get the current road traffic conditions",
    "arguments": {
        "location": {
            "description": "The city and state, e.g. San Francisco, CA",
            "required": true
        }
    },
    execute: run_get_current_traffic
};

async function main() {
    const lm = new Lm({
        providerType: "openai",
        serverUrl: serverUrl,
        apiKey: apiKey,
        onToken: (t) => process.stdout.write(t),
    });
    const agent = new Agent(lm);
    await agent.run(_prompt,
        //inference params
        {
            model: model ?? "",
            temperature: 0.5,
            top_k: 40,
            top_p: 0.95,
            min_p: 0,
            max_tokens: 4096,
        },
        // query options
        {
            debug: false,
            verbose: true,
            system: system,
            tools: [get_current_weather, get_current_traffic]
        });
}

(async () => {
    await main();
})();
```

## Server api example

To execute a task using the server http api:

```js
import { useServer } from "@agent-smith/apicli";

const api = useServer({
    apiKey: "server_api_key",
    onToken: (t) => {
        // handle the streamed tokens here
        process.stdout.write(t)
    }
});
await api.executeTask(
    "translate", 
    "Which is the largest planet of the solar system?", 
    { lang: "german" }
)
```

## Libraries

The cli is powered by:

- [Locallm](https://github.com/synw/locallm) for the inference api servers management
- [Modprompt](https://github.com/synw/modprompt) for the prompt templates management

The server is powered by:

- [Echo](https://github.com/labstack/echo)

![Agent Smith](docsite/public/img/job.jpg)
