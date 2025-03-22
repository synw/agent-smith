import { input } from '@inquirer/prompts';
import { chat, runCmd } from './cmd/cmds.js';
import { isChatMode } from './state/state.js';
import { setOptions } from './cmd/lib/utils.js';
import { modes } from './cmd/clicmds/modes.js';

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
    //console.log("Dispatch", input);
    // modes
    if (input.startsWith("-")) {
        try {
            const _cmd = modes[input].cmd;
            await _cmd([], {});
            return
        } catch (e) {
            throw new Error(`Option error ${e}`)
        }
    }
    // args
    const buf = new Array<string>();
    let params = parseParams(input);
    const cmd = params.shift()!;
    const opts: Record<string, any> = {};
    params.forEach((p) => {
        if (p.startsWith("-")) {
            opts[p.substring(1)] = true;
        } else {
            buf.push(p)
        }
    });
    const args = await setOptions(buf, opts);
    await runCmd(cmd, args)
}

async function query(sign = "$") {
    const data = { message: sign, default: "" };
    const q = await input(data);
    await dispatch(q);
    if (isChatMode.value) {
        await chat()
    }
    await query(sign)
}

export { query }
