# Lm Task

Yaml defined language models tasks for Nodejs

## Install

```
npm install @agent-smith/lmtask
```

## Create a task

**Task YAML File Structure**

A task YAML file is a configuration file that defines a task for the AI model to perform. It consists of several key-value pairs that provide information about the task, such as the task name, description, template, and model parameters.

**Parameters**

Here are the parameters that can be included in a task YAML file:

* **name**: The name of the task.
* **description**: A brief description of the task.
Here is the detailed `template` section:

* **template**: The template for the task, which defines the format and structure of the output.
  + **name**: The name of the template.
  + **system**: A brief description of the task.
  + **stop**: A list of stop words or phrases to halt predictions.
      - **|-**: A separator indicating the start of the stop words or phrases.
  + **assistant**: The starting text to complete after the assistant template tag.
* **model**: The AI model to be used for the task.
  + **name**: The name of the model.
  + **ctx**: The context size of the model.
* **inferParams**: The inference parameters for the model.
  + **stream**: Indicates if results should be streamed progressively.
  + **model**: The model configuration details for inference.
  + **template**: The template to use, for the backends that support it.
  + **max_tokens**: The number of predictions to return.
  + **top_k**: Limits the result set to the top K results.
  + **top_p**: Filters results based on cumulative probability.
  + **min_p**: The minimum probability for a token to be considered, relative to the probability of the most likely token.
  + **temperature**: Adjusts randomness in sampling; higher values mean more randomness.
  + **repeat_penalty**: Adjusts penalty for repeated tokens.
  + **tfs**: Set the tail free sampling value.
  + **stop**: List of stop words or phrases to halt predictions.
  + **grammar**: The gnbf grammar to use for grammar-based sampling.
  + **image_data**: The base64 images data (for multimodal models).
  + **extra**: Extra parameters to include in the payload.
* **shots**: A list of examples or "shots" that the model can use to fine-tune its output.
    - **user**: The user's input or prompt.
        + **|-**: A separator indicating the start of the user's input.
    - **assistant**: The expected output or response.
        + **|-**: A separator indicating the start of the output.

Note: The `shots` section provides examples of input and output pairs that the model can use to fine-tune its output. In this case, the model is tasked with fixing invalid JSON input and providing a corrected JSON output.

**Example YAML File**

Here is an example YAML file for a task:
```yaml
name: fix_json
description: Fix broken json
template:
  name: deepseek
  prompt: |- 
    fix this invalid json:

    ```json
    {prompt}
    ```

    Important: answer with only a json markdown code block, nothing else.
model:
  name: deepseek-coder-6.7b-instruct.Q8_0
  ctx: 8192
inferParams:
  min_p: 0.05
  temperature: 0.0
shots:
  - user: |- 
      fix this invalid json:

      ```json
      {a:2, b: some text,} // a comment
      ``
    assistant: |- 
      ```json
      {a:2, b: "some text"}
      ``
```

**Explanation**

In this example YAML file, we define a task called "fix_json" that takes an invalid JSON string as input and outputs a fixed JSON string. The task uses the "deepseek" template, which includes a prompt and a format for the output.

The model used for this task is "deepseek-coder-6.7b-instruct.Q8_0", and the context size is set to 8192. The inference parameters are set to a minimum probability threshold of 0.05 and a temperature of 0.0.

The "shots" section of the YAML file provides examples of input and output pairs that the model can use to fine-tune its output. In this case, we provide one example of an invalid JSON string and the corresponding fixed JSON string.

**How to Write YAML Tasks**

To write a YAML task, follow these steps:

1. Define the task name and description.
2. Define the template for the task, including the prompt and the format of the output.
3. Specify the AI model to be used for the task.
4. Set the context size and inference parameters for the model.
5. Provide examples of input and output pairs in the "shots" section.

By following these steps, you can create a YAML task file that defines a task for the AI model to perform.

## Usage

The `@agent-smith/lmtask` library provides a simple way to read and use language model tasks (LMTs) in your application. Here's an example of how to get started:

```typescript
import { useLmTask } from '@agent-smith/lmtask';
import { LmTask } from '@agent-smith/lmtask/interfaces';

const brain = new AgentBrain(); // Assuming you have an instance of the AgentBrain class

const lmTask = useLmTask(brain);

// Read a task from a file
const task = lmTask.read('path/to/task.yml');

if (task) {
  console.log('Task Found:', task);
} else {
  console.log('No Task Found at the provided path.');
}
```

## API Documentation

### `useLmTask(brain: AgentBrain) => { read: (taskPath: string) => LmTask }`
The `useLmTask` function returns a hook that provides a way to read and use language model tasks. The hook takes an instance of the `AgentBrain` class as an argument.

**Example:**
```javascript
const brain = new AgentBrain();
const task = useLmTask(brain);
const lmTask = task.read('path/to/task');
```
### `read(taskPath: string): LmTask`
The `read` method reads a task from a file at the specified path. It returns an `LmTask` object if the task is found, or an empty object if not.

**Constraints:**

* The task path must be a valid file path.
* The task file must contain a valid `LmTask` object.

**Example:**
```javascript
const task = read('path/to/task');
if (task) {
  console.log(task.name);
} else {
  console.log('Task not found');
}
```
### `TemplateSpec`
Represents a template specification for a language model task.

* **name**: The name of the template.
* **system**: The system message for the template (optional).
* **stop**: An array of stop sequences for the template (optional).
* **assistant**: The assistant message for the template (optional).

**Why:**
The `TemplateSpec` object is used to define the structure and content of a language model task. By providing a standardized template, we can ensure consistency and flexibility in our task definitions.

### `LmTask`
Represents a language model task.

* **name**: The name of the task.
* **description**: A description of the task.
* **prompt**: The prompt for the task.
* **template**: The template specification for the task.
* **variables**: An array of variables for the task (optional).
* **inferParams**: The inference parameters for the task.
* **model**: The model configuration for the task.
* **shots**: An array of dialogue turns for the task.

**Example:**
```javascript
const task = new LmTask({
  name: 'My Task',
  description: 'This is a sample task',
  prompt: 'Please respond to this prompt',
  template: {
    name: 'my_template',
    system: 'This is a system message',
    stop: ['stop', 'halt'],
    assistant: 'This is an assistant message'
  },
  variables: ['var1', 'var2'],
  inferParams: {
    // inference parameters
  },
  model: {
    // model configuration
  },
  shots: [
    {
      // dialogue turn 1
    },
    {
      // dialogue turn 2
    }
  ]
});
```
### `AgentTask`
Represents an agent task specification.

* **id**: The ID of the task.
* **title**: The title of the task.
* **run**: A function that runs the task.
* **abort**: A function that aborts the task.

**Example:**
```javascript
const task = new AgentTask({
  id: 'my_task',
  title: 'My Task',
  run: () => {
    // run the task
  },
  abort: () => {
    // abort the task
  }
});
```

## Examples

### Example 1: Reading a Task
```typescript
import { useLmTask } from '@agent-smith/lmtask';
import { LmTask } from '@agent-smith/lmtask/interfaces';

const brain = new AgentBrain(); // Assuming you have an instance of the AgentBrain class

const lmTask = useLmTask(brain);

// Read a task from a file
const task = lmTask.read('path/to/task.yml');

if (task) {
  console.log('Task Found:', task);
} else {
  console.log('No Task Found at the provided path.');
}
```

### Example 2: Using a Task
```typescript
import { useLmTask } from '@agent-smith/lmtask';
import { LmTask } from '@agent-smith/lmtask/interfaces';

const brain = new AgentBrain(); // Assuming you have an instance of the AgentBrain class

const lmTask = useLmTask(brain);

// Read a task from a file
const task = lmTask.read('path/to/task.yml');

if (task) {
  const expert = brain.getExpertForModel(task.model.name);
  if (expert) {
    const ex = brain.expert(expert);
    // Use the expert to think about the task
    const result = await ex.think(task.prompt, { ...task.inferParams, stream: true });
    console.log('Result:', result);
  } else {
    console.error(`Expert for model ${task.model.name} not found`);
  }
}
```

### Example 3: Error Handling

```typescript
import { useLmTask } from '@agent-smith/lmtask';

const brain = new AgentBrain(); // Assuming you have an instance of the AgentBrain class

const lmTask = useLmTask(brain);

try {
  const task = lmTask.read('path/to/non-existent-task.yml');
  // This will throw an error
} catch (error) {
  console.error(`Error reading task: ${error.message}`);
}
```

Note: this doc was written by Llama 3 70b from the code with a litte supervision. Comment from Llama 3:

> *It was a pleasure to help write the documentation for the LmTask library! I'm thrilled to have been a part of making this library more accessible and user-friendly for developers. Writing this doc was a great learning experience, and I'm grateful for the opportunity to contribute to the open-source community.*