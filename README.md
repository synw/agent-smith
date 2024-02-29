# Agent Smith

An api to create local first human friendly agents in the browser or Nodejs

![Agent Smith](docsite/public/img/agentsmith.png)

:books: [Documentation](https://synw.github.io/agent-smith/)

## What is an agent?

An agent is an anthropomorphic representation of a bot. It has these basic habilities:

- **Interact with the user**: the agent can perform interactions like to talk or to ask the user to confirm or decline an action
- **Think**: interact with some language model servers to perform inference queries

## Packages

| Version | Name | Description |
| --- | --- | --- |
| [![pub package](https://img.shields.io/npm/v/@agent-smith/body)](https://www.npmjs.com/package/@agent-smith/body) | [@agent-smith/body](https://github.com/synw/agent-smith/tree/main/packages/body) | The body |
| [![pub package](https://img.shields.io/npm/v/@agent-smith/brain)](https://www.npmjs.com/package/@agent-smith/brain) | [@agent-smith/brain](https://github.com/synw/agent-smith/tree/main/packages/brain) | The brain |

## FAQ

- What local inference servers can I use?

Actually it works with Llama.cpp and Koboldcpp. Ollama support is planned.

- Can I use this with OpenAI or other big apis?

Sorry no: this library favours local first or private remote inference servers

## Documentation

- [The body](https://synw.github.io/agent-smith/the_body)
- [Overview](https://synw.github.io/agent-smith/the_body/overview)
- [Install](https://synw.github.io/agent-smith/the_body/install)
- [Basic agent](https://synw.github.io/agent-smith/the_body/basic_agent)
    - [Interactions](https://synw.github.io/agent-smith/the_body/interactions)
    - [Talk](https://synw.github.io/agent-smith/the_body/interactions/talk)
    - [Dynamic component](https://synw.github.io/agent-smith/the_body/interactions/dynamic_component)
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

## Example

Quick Nodejs example:

```ts
const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "mistral",
    onToken: (t) => process.stdout.write(t),
});
const brain = useAgentBrain([expert]);
const bob = useAgentSmith({
    name: "Bob",
    modules: [brain],
});
// auto discover if expert's inference servers are up
await bob.brain.discover();
// run an inference query
const _prompt = "list the planets of the solar sytem";
await bob.think(_prompt, { temperature: 0.2 });
```
