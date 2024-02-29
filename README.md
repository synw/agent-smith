# Agent Smith

An api to create local first human friendly agents in the browser or Nodejs

![Agent Smith](docsite/public/img/agentsmith.png)

:books: [Documentation](https://synw.github.io/agent-smith/)

## What is an agent?

An agent is an anthropomorphic representation of a bot. It has these basic habilities:

- *Interact with the user*: the agent can perform interactions like to talk or to ask the user to confirm or decline an action
- *Think*: interact with some language model servers to perform inference queries

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
