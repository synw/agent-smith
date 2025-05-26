# Agent Smith

An api to create local first human friendly agents in the browser or Nodejs

![Agent Smith](docsite/public/img/agentsmith.png)

<details>
<summary>:books: Read the <a href="https://synw.github.io/agent-smith">documentation</a></summary>

 - [Libraries](https://synw.github.io/agent-smith/libraries)
     - [The body](https://synw.github.io/agent-smith/libraries/the_body)
        - [Overview](https://synw.github.io/agent-smith/libraries/the_body/overview)
        - [Install](https://synw.github.io/agent-smith/libraries/the_body/install)
        - [Basic agent](https://synw.github.io/agent-smith/libraries/the_body/basic_agent)
         - [Interactions](https://synw.github.io/agent-smith/libraries/the_body/interactions)
            - [Talk](https://synw.github.io/agent-smith/libraries/the_body/interactions/talk)
            - [Components](https://synw.github.io/agent-smith/libraries/the_body/interactions/components)
            - [Confirm](https://synw.github.io/agent-smith/libraries/the_body/interactions/confirm)
     - [The brain](https://synw.github.io/agent-smith/libraries/the_brain)
        - [Overview](https://synw.github.io/agent-smith/libraries/the_brain/overview)
        - [Install](https://synw.github.io/agent-smith/libraries/the_brain/install)
        - [Backends](https://synw.github.io/agent-smith/libraries/the_brain/backends)
        - [Experts](https://synw.github.io/agent-smith/libraries/the_brain/experts)
        - [Brain](https://synw.github.io/agent-smith/libraries/the_brain/brain)
        - [Grammars](https://synw.github.io/agent-smith/libraries/the_brain/grammars)
        - [Browser](https://synw.github.io/agent-smith/libraries/the_brain/browser)
         - [Templates](https://synw.github.io/agent-smith/libraries/the_brain/templates)
            - [Basics](https://synw.github.io/agent-smith/libraries/the_brain/templates/basics)
            - [History](https://synw.github.io/agent-smith/libraries/the_brain/templates/history)
            - [Few shots](https://synw.github.io/agent-smith/libraries/the_brain/templates/few_shots)
     - [Jobs](https://synw.github.io/agent-smith/libraries/jobs)
        - [Get started](https://synw.github.io/agent-smith/libraries/jobs/get_started)
        - [Create a job](https://synw.github.io/agent-smith/libraries/jobs/create_a_job)
        - [Config](https://synw.github.io/agent-smith/libraries/jobs/config)
        - [State management](https://synw.github.io/agent-smith/libraries/jobs/state_management)
        - [Memory](https://synw.github.io/agent-smith/libraries/jobs/memory)
     - [Lm task](https://synw.github.io/agent-smith/libraries/lm_task)
        - [Get started](https://synw.github.io/agent-smith/libraries/lm_task/get_started)
        - [Specification](https://synw.github.io/agent-smith/libraries/lm_task/specification)
        - [Use tasks](https://synw.github.io/agent-smith/libraries/lm_task/use_tasks)
        - [Variables](https://synw.github.io/agent-smith/libraries/lm_task/variables)
        - [Templates](https://synw.github.io/agent-smith/libraries/lm_task/templates)
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
    - [Models](https://synw.github.io/agent-smith/terminal_client/models)
    - [Actions](https://synw.github.io/agent-smith/terminal_client/actions)
    - [Workflows](https://synw.github.io/agent-smith/terminal_client/workflows)
    - [Commands](https://synw.github.io/agent-smith/terminal_client/commands)
    - [Tools call](https://synw.github.io/agent-smith/terminal_client/tools_call)
 - [Plugins](https://synw.github.io/agent-smith/plugins)
    - [Overview](https://synw.github.io/agent-smith/plugins/overview)
    - [Models](https://synw.github.io/agent-smith/plugins/models)
    - [Inference](https://synw.github.io/agent-smith/plugins/inference)
    - [Vision](https://synw.github.io/agent-smith/plugins/vision)
     - [Code](https://synw.github.io/agent-smith/plugins/code)
        - [Git](https://synw.github.io/agent-smith/plugins/code/git)
     - [Web](https://synw.github.io/agent-smith/plugins/web)
        - [Video](https://synw.github.io/agent-smith/plugins/web/video)
 - [Server](https://synw.github.io/agent-smith/server)
    - [Get started](https://synw.github.io/agent-smith/server/get_started)
    - [Configuration](https://synw.github.io/agent-smith/server/configuration)
    - [Tasks](https://synw.github.io/agent-smith/server/tasks)
    - [Endpoints](https://synw.github.io/agent-smith/server/endpoints)
 - [Examples](https://synw.github.io/agent-smith/examples)
    - [Data viz](https://synw.github.io/agent-smith/examples/data_viz)

</details>

Check the :computer: [examples](examples)

## What is an agent?

An agent is an anthropomorphic representation of a bot. It can:

- **Think**: use language model servers to perform inference queries
- **Interact**: perform interactions with the user and get input and feedback
- **Work**: manage long running jobs with multiple tasks, use custom terminal commands
- **Remember**: use transient or semantic memory to store data

## Packages

| Version | Name | Description | Nodejs | Browser |
| --- | --- | --- | --- | --- |
| [![pub package](https://img.shields.io/npm/v/@agent-smith/body)](https://www.npmjs.com/package/@agent-smith/body) | [@agent-smith/body](https://github.com/synw/agent-smith/tree/main/packages/body) | The body | :x: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/brain)](https://www.npmjs.com/package/@agent-smith/brain) | [@agent-smith/brain](https://github.com/synw/agent-smith/tree/main/packages/brain) | The brain | :white_check_mark: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/jobs)](https://www.npmjs.com/package/@agent-smith/jobs) | [@agent-smith/jobs](https://github.com/synw/agent-smith/tree/main/packages/jobs) | Jobs | :white_check_mark: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/tmem)](https://www.npmjs.com/package/@agent-smith/tmem) | [@agent-smith/tmem](https://github.com/synw/agent-smith/tree/main/packages/tmem) | Transient memory | :x: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/tmem-jobs)](https://www.npmjs.com/package/@agent-smith/tmem-jobs) | [@agent-smith/tmem-jobs](https://github.com/synw/agent-smith/tree/main/packages/tmem-jobs) | Jobs transient memory | :x: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/smem)](https://www.npmjs.com/package/@agent-smith/smem) | [@agent-smith/smem](https://github.com/synw/agent-smith/tree/main/packages/smem) | Semantic memory | :white_check_mark: | :x:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/tfm)](https://www.npmjs.com/package/@agent-smith/tfm) | [@agent-smith/tfm](https://github.com/synw/agent-smith/tree/main/packages/tfm) | Templates for models | :white_check_mark: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/lmtask)](https://www.npmjs.com/package/@agent-smith/lmtask) | [@agent-smith/lmtask](https://github.com/synw/agent-smith/tree/main/packages/lmtask) | Yaml model task | :white_check_mark: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/cli)](https://www.npmjs.com/package/@agent-smith/cli) | [@agent-smith/cli](https://github.com/synw/agent-smith/tree/main/packages/cli) | Terminal client | :white_check_mark: | :x:

## Philosophy

- **Composable**: the packages have limited responsibilities and can work together
- **Declarative**: focus on the business logic by expressing features simply
- **Explicit**: keep it simple and under user control: no hidden magic

## FAQ

- *What local or remote inference servers can I use?*

Actually it works with [Llama.cpp](https://github.com/ggerganov/llama.cpp/tree/master/examples/server),
[Koboldcpp](https://github.com/LostRuins/koboldcpp) and [Ollama](https://github.com/ollama/ollama).

It also works [in the browser](https://synw.github.io/agent-smith/the_brain/browser) using gpu only inference and small models

- *Can I use this with OpenAI or other big apis?*

Sorry no: this library favours local first or private remote inference servers

## Example

### Terminal client

Simple inference query (using the [inference](https://synw.github.io/agent-smith/plugins/inference) plugin):

```bash
lm q list the planets of the solar system
```

Query a thinking model, use qwq (from the [models](https://synw.github.io/agent-smith/plugins/models) plugin)::

```bash
lm think "solve this math problem: ..." m=qwq
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

## Nodejs example

```ts
const backend = useLmBackend({
    name: "koboldcpp",
    localLm: "koboldcpp",
    onToken: (t) => process.stdout.write(t),
});

const ex = useLmExpert({
    name: "koboldcpp",
    backend: backend,
    template: templateName,
    model: { name: modelName, ctx: 2048 },
});
const brain = useAgentBrain([expert]);

console.log("Auto discovering brain backend ...");
await brain.init();
brain.ex.checkStatus();
if (brain.ex.state.get().status != "ready") {
        throw new Error("The expert's backend is not ready")
    }
// run an inference query
const _prompt = "list the planets of the solar sytem";
await brain.think(_prompt, { 
   temperature: 0.2, 
   min_p: 0.05 
});
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

- [Nanostores](https://github.com/nanostores/nanostores) for the state management and reactive variables
- [Locallm](https://github.com/synw/locallm) for the inference api servers management
- [Modprompt](https://github.com/synw/modprompt) for the prompt templates management

The server is powered by:

- [Echo](https://github.com/labstack/echo)
