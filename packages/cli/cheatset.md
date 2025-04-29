 

# Agent Smith Terminal Client Cheat Sheet

## Install

```bash
npm i -g @agent-smith/cli
```

## Quickstart

Install plugins:

```bash
npm i -g @agent-smith/feat-inference @agent-smith/feat-vision @agent-smith/feat-models
```

Create `config.yml`:

```yml
plugins:
  - "@agent-smith/feat-inference"
  - "@agent-smith/feat-vision"
  - "@agent-smith/feat-models"
```

Run conf command:

```bash
lm conf ~/path/to/config.yml
```

## Inference

Run inference query:

```bash
lm q list the planets of the solar system m="llama3.1:latest"
```

## Vision

Pull model and run vision query:

```bash
lm vision imgs/img1.jpeg imgs/img2.jpeg "Compare the images"
```

## Tasks

List tasks:

```bash
lm tasks
```

Show task details:

```bash
lm task my_task
```

Run task:

```bash
lm infer "List the planets in the solar system"
```

Override model and template:

```bash
lm infer "List the planets in the solar system" m="some_model.gguf/chatml"
```

## Models

Show available models:

```bash
lm models
```

Search for a model:

```bash
lm model qwen
```

## Commands

Ping local inference servers:

```bash
lm ping
```

List commands:

```bash
lm help
```

Custom command example:

```js
import select from '@inquirer/select';
import { execute, executeTaskCmd, writeToClipboard, pingCmd } from "@agent-smith/cli";

const choices = [
    {
        name: 'Commit',
        value: 'commit',
        description: 'Run the commit command with this message',
    },
    {
        name: 'Copy',
        value: 'copy',
        description: 'Copy the commit message to the clipboard',
    },
    {
        name: 'Cancel',
        value: 'cancel',
        description: 'Cancel the commit',
    },
];

async function runCmd(args = [], options) {
    const isUp = await pingCmd();
    if (!isUp) {
        throw new Error("No inference server found, canceling")
    }
    console.log("Generating a commit message ...");
    const res = await executeTaskCmd("git_commit", args);
    const answer = await select({
        message: 'Select an action',
        default: "commit",
        choices: choices,
    });
    switch (answer) {
        case "copy":
            writeToClipboard(final)
            break;
        case "commit":
            console.log("git commit -m", res);
            const res2 = await execute("git", ["commit", ...flagPath, "-m", res]);
            console.log(res2);
            break;
        default:
            console.log("Commit canceled");
            break;
    }
}

const cmd = {
    cmd: runCmd,
    description: "Create a git commit message from a git diff",
};

export { cmd };
```

## Options

### Input mode

Command line input:

```bash
lm infer "some prompt"
```

Clipboard input:

```bash
lm infer --ic
```

Promptfile input:

```yml
promptfile: /home/me/lm/features/src/prompt.txt
features:
  - /home/me/lm/features/dist
plugins:
  - "@docdundee/agent"
  - "@agent-smith/feat-git"
```

Run with promptfile:

```bash
lm infer --if
```

### Output mode

Markdown output:

```bash
lm --omd
```

Text output:

```bash
lm --otxt
```

Clipboard output:

```bash
lm --oc
```

### Chat mode

Chat after task:

```bash
lm infer "list the planets of the solar system" -c
```

### Debug mode

Debug information:

```bash
lm -d
```