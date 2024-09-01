# Agent Smith

An api to create local first human friendly agents in the browser or Nodejs

![Agent Smith](docsite/public/img/agentsmith.png)

<details>
<summary>:books: Read the <a href="https://synw.github.io/agent-smith">documentation</a></summary>

 - [The body](https://synw.github.io/agent-smith/the_body)
    - [Overview](https://synw.github.io/agent-smith/the_body/overview)
    - [Install](https://synw.github.io/agent-smith/the_body/install)
    - [Basic agent](https://synw.github.io/agent-smith/the_body/basic_agent)
     - [Interactions](https://synw.github.io/agent-smith/the_body/interactions)
        - [Talk](https://synw.github.io/agent-smith/the_body/interactions/talk)
        - [Components](https://synw.github.io/agent-smith/the_body/interactions/components)
        - [Confirm](https://synw.github.io/agent-smith/the_body/interactions/confirm)
 - [The brain](https://synw.github.io/agent-smith/the_brain)
    - [Overview](https://synw.github.io/agent-smith/the_brain/overview)
    - [Install](https://synw.github.io/agent-smith/the_brain/install)
    - [Basics](https://synw.github.io/agent-smith/the_brain/basics)
    - [Options](https://synw.github.io/agent-smith/the_brain/options)
    - [Grammars](https://synw.github.io/agent-smith/the_brain/grammars)
    - [Multiple experts](https://synw.github.io/agent-smith/the_brain/multiple_experts)
     - [Templates](https://synw.github.io/agent-smith/the_brain/templates)
        - [Basics](https://synw.github.io/agent-smith/the_brain/templates/basics)
        - [History](https://synw.github.io/agent-smith/the_brain/templates/history)
        - [Few shots](https://synw.github.io/agent-smith/the_brain/templates/few_shots)
 - [Jobs](https://synw.github.io/agent-smith/jobs)
    - [Get started](https://synw.github.io/agent-smith/jobs/get_started)
    - [Create a job](https://synw.github.io/agent-smith/jobs/create_a_job)
    - [Config](https://synw.github.io/agent-smith/jobs/config)
    - [State management](https://synw.github.io/agent-smith/jobs/state_management)
    - [Memory](https://synw.github.io/agent-smith/jobs/memory)
 - [Lm task](https://synw.github.io/agent-smith/lm_task)
    - [Readme](https://synw.github.io/agent-smith/lm_task/readme)
 - [Transient memory](https://synw.github.io/agent-smith/transient_memory)
    - [Get started](https://synw.github.io/agent-smith/transient_memory/get_started)
    - [Usage](https://synw.github.io/agent-smith/transient_memory/usage)
    - [Api](https://synw.github.io/agent-smith/transient_memory/api)
 - [Semantic memory](https://synw.github.io/agent-smith/semantic_memory)
    - [Get started](https://synw.github.io/agent-smith/semantic_memory/get_started)
    - [Initialize](https://synw.github.io/agent-smith/semantic_memory/initialize)
    - [Write operations](https://synw.github.io/agent-smith/semantic_memory/write_operations)
    - [Read operations](https://synw.github.io/agent-smith/semantic_memory/read_operations)
 - [Terminal client](https://synw.github.io/agent-smith/terminal_client)
    - [Install](https://synw.github.io/agent-smith/terminal_client/install)
    - [Overview](https://synw.github.io/agent-smith/terminal_client/overview)
    - [Config](https://synw.github.io/agent-smith/terminal_client/config)
    - [Commands](https://synw.github.io/agent-smith/terminal_client/commands)
    - [Options](https://synw.github.io/agent-smith/terminal_client/options)
    - [Plugins](https://synw.github.io/agent-smith/terminal_client/plugins)
 - [Examples](https://synw.github.io/agent-smith/examples)
    - [Data viz](https://synw.github.io/agent-smith/examples/data_viz)

</details>

Check the :computer: [Starter template](https://github.com/synw/agent-smith/tree/main/template)

## What is an agent?

An agent is an anthropomorphic representation of a bot. It can:

- **Think**: interact with some language model servers to perform inference queries
- **Interact**: the agent can perform interactions with the user and get input and feedback
- **Work**: manage long running jobs with multiple tasks, use custom terminal commands
- **Remember**: use it's transient or semantic memory to store data

## Packages

| Version | Name | Description | Nodejs | Browser |
| --- | --- | --- | --- | --- |
| [![pub package](https://img.shields.io/npm/v/@agent-smith/body)](https://www.npmjs.com/package/@agent-smith/body) | [@agent-smith/body](https://github.com/synw/agent-smith/tree/main/packages/body) | The body | :white_check_mark: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/brain)](https://www.npmjs.com/package/@agent-smith/brain) | [@agent-smith/brain](https://github.com/synw/agent-smith/tree/main/packages/brain) | The brain | :white_check_mark: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/jobs)](https://www.npmjs.com/package/@agent-smith/jobs) | [@agent-smith/jobs](https://github.com/synw/agent-smith/tree/main/packages/jobs) | Jobs | :white_check_mark: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/tmem)](https://www.npmjs.com/package/@agent-smith/tmem) | [@agent-smith/tmem](https://github.com/synw/agent-smith/tree/main/packages/tmem) | Transient memory | :x: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/tmem-jobs)](https://www.npmjs.com/package/@agent-smith/tmem-jobs) | [@agent-smith/tmem-jobs](https://github.com/synw/agent-smith/tree/main/packages/tmem-jobs) | Jobs transient memory | :x: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/smem)](https://www.npmjs.com/package/@agent-smith/smem) | [@agent-smith/smem](https://github.com/synw/agent-smith/tree/main/packages/smem) | Semantic memory | :white_check_mark: | :x:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/tfm)](https://www.npmjs.com/package/@agent-smith/tfm) | [@agent-smith/tfm](https://github.com/synw/agent-smith/tree/main/packages/tfm) | Templates for models | :white_check_mark: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/lmtask)](https://www.npmjs.com/package/@agent-smith/lmtask) | [@agent-smith/lmtask](https://github.com/synw/agent-smith/tree/main/packages/lmtask) | Yaml model task | :white_check_mark: | :white_check_mark:
| [![pub package](https://img.shields.io/npm/v/@agent-smith/cli)](https://www.npmjs.com/package/@agent-smith/cli) | [@agent-smith/cli](https://github.com/synw/agent-smith/tree/main/packages/cli) | Terminal client | :white_check_mark: | :x:

## FAQ

- *What local or remote inference servers can I use?*

Actually it works with [Llama.cpp](https://github.com/ggerganov/llama.cpp/tree/master/examples/server),
[Koboldcpp](https://github.com/LostRuins/koboldcpp) and [Ollama](https://github.com/ollama/ollama).

- *Can I use this with OpenAI or other big apis?*

Sorry no: this library favours local first or private remote inference servers

## Example

### Terminal client

Generate a commit message in a git repository (using the `@agent-smith/feat-cli` plugin):

```bash
lm commit .
```

### Nodejs

```ts
const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "mistral",
    onToken: (t) => process.stdout.write(t),
});
const brain = useAgentBrain([expert]);
// auto discover if expert's inference servers are up
await brain.discover();
// run an inference query
const _prompt = "list the planets of the solar sytem";
await brain.think(_prompt, { 
   temperature: 0.2, 
   min_p: 0.05 
});
```

## Libraries

Powered by:

- [Nanostores](https://github.com/nanostores/nanostores) for the state management and reactive variables
- [Locallm](https://github.com/synw/locallm) for the inference api servers management
- [Modprompt](https://github.com/synw/modprompt) for the prompt templates management
