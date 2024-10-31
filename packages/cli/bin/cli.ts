import { input } from '@inquirer/prompts';
import { runCmd } from './cmd/cmds.js';
import { lastCmd, inputMode } from './state/state.js';
import { readPromptFile } from './cmd/lib/utils.js';
import { readClipboard } from './cmd/sys/clipboard.js';

/**
 * Parses a string of parameters, which may include quoted strings and standalone words.
 * The function uses a regular expression to identify and extract these parameters.
 * 
 * @param params - The string of parameters to be parsed.
 * @returns An array of parsed parameters.
 * 
 * @example
 * ```typescript
 * console.log(parseParams('"hello world" 123 -param')); // Output: ['hello world', '123', '-param']
 * console.log(parseParams('hello "world" 123')); // Output: ['hello', 'world', '123']
 * ```
 */
function parseParams(params: string): Array<string> {
    const regex = /"([^"]*)"|(\S+)/g;
    let match;
    const result = new Array<any>();
    while ((match = regex.exec(params)) !== null) {
        if (match[1]) {
            result.push(match[1]);
        } else {
            result.push(match[2]);
        }
    }
    return result;
}

async function dispatch(input: string) {
    let buf = new Array<string>();
    buf = parseParams(input);
    const cmd = buf.shift()!;
    if (inputMode.value == "promptfile") {
        const p = readPromptFile();
        buf.push(p)
    } else if (inputMode.value == "clipboard") {
        const p = await readClipboard();
        buf.push(p)
    }
    await runCmd(cmd, buf)
}

async function query(_default?: string) {
    const data = { message: '>', default: "" };
    if (_default) {
        data.default = _default
    }
    const answer = await input(data);
    await dispatch(answer);
    const lc = lastCmd.name + " " + lastCmd.args.join(" ");
    await query(lc)
}

export { query }
