import { InvalidArgumentError, Option } from "commander";

const baseOptions: Array<Option> = [
    new Option("-v, --verbose", "use the verbose mode"),
    new Option("-d, --debug", "use the debug mode"),
    new Option("--tokens", "toggle show tokens mode"),
];

const inferenceOptions: Array<Option> = [
    new Option("-s, --stream", "use the stream mode"),
    new Option("-m, --model <name>", "the model name").argParser(parseString),
    new Option("-x, --ctx", "context window size").argParser(parseIntValue),
    new Option("-t, --template <template>", "the template to use"),
    new Option("-o, --max_tokens <number>", "the number of predictions to return").argParser(parseIntValue),
    new Option("-k, --top_k <number>", "limits the result set to the top K results").argParser(parseIntValue),
    new Option("-p, --top_p <number>", "filters results based on cumulative probability").argParser(parseFloatValue),
    new Option("-i, --min_p <number>", "the minimum probability for a token to be considered, relative to the probability of the most likely token").argParser(parseFloatValue),
    new Option("-u, --temperature <number>", "adjusts randomness in sampling; higher values mean more randomness").argParser(parseFloatValue),
    new Option("-r, --repeat_penalty <number>", "adjusts penalty for repeated tokens").argParser(parseFloatValue),
]

const ioOptions: Array<Option> = [
    new Option("--if, --input-file", "use promptfile input mode"),
    new Option("--ic, --clipboard-input", "use clipboard input mode"),
    new Option("--im, --manual-input", "use manual input mode (default)"),
    new Option("--oc, --clipboard-output", "use clipboard output mode"),
    new Option("--omd, --markdown-output", "use markdown output"),
    new Option("--otxt, --text-output", "use text output (default)"),
]

const taskOptions: Array<Option> = [
    ...baseOptions,
    ...ioOptions,
    ...inferenceOptions,
    new Option("-c, --chat-mode", "toggle chat mode for tasks"),
];

const actionOptions: Array<Option> = [
    ...baseOptions,
    ...ioOptions,
];

const workflowOptions: Array<Option> = [
    ...taskOptions
];

function parseString(value: string): string {
    if (typeof value !== 'string') throw new InvalidArgumentError('The value must be a string');
    return value;
}

function parseIntValue(value: string): number {
    if (typeof value !== 'string') throw new InvalidArgumentError('The value must be a string');
    const num = parseInt(value);
    if (!isNaN(num)) return num;
    else throw new InvalidArgumentError(`Invalid integer: ${value}`);
}

function parseFloatValue(value: string): number {
    if (typeof value !== 'string') throw new InvalidArgumentError('The value must be a string');
    const num = parseFloat(value);
    if (!isNaN(num)) return num;
    else throw new InvalidArgumentError(`Invalid float: ${value}`);
}

export {
    baseOptions,
    taskOptions,
    actionOptions,
    workflowOptions,
}