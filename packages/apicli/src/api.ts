import { createParser, EventSourceMessage } from 'eventsource-parser';
import { ServerParams } from './interfaces.js';

const useServer = (params: ServerParams) => {
    const url = params?.url ? params.url : "http://localhost:5042";
    const isVerbose = params?.isVerbose ? params.isVerbose : true;

    const _onParse = (event: EventSourceMessage) => {
        const msg = JSON.parse(event.data);
        switch (msg.msg_type) {
            case "system":
                if (msg.content == "start_emitting") {
                    if (isVerbose) {
                        if (msg?.data?.thinking_time_format) {
                            console.log("Thinking time:", msg.data.thinking_time_format)
                        }
                    }
                } else if (msg.content == "result") {
                    if (isVerbose) {
                        if (msg.data?.stats) {
                            const tps = msg.data.stats.tokensPerSecond;
                            const tt = msg.data.stats.totalTokens;
                            const ti = msg.data.stats.totalTimeFormat;
                            console.log("\nTotal tokens:", tt);
                            console.log("Total time:", ti);
                            console.log("Tokens per second:", tps);
                            //console.log(msg.data)
                        }
                    }
                }
                break;
            case "error":
                throw new Error("Error: " + msg.content)
            default:
                params.onToken(msg.content);
        }
    }

    const executeCmd = async (cmdName: string, _params: Array<string> = []) => {
        const parser = createParser({ onEvent: _onParse });
        const payload = { cmd: cmdName, params: _params };
        if (isVerbose) {
            console.log("Executing command ...")
        }
        const response = await fetch(url + "/cmd/execute", {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',
                'Authorization': `Bearer ${params.apiKey}`,
            },
        });
        if (!response?.body) {
            throw new Error("No response")
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const result = await reader.read();
            if (result.done) {
                break;
            }
            const chunk = decoder.decode(result.value);
            parser.feed(chunk)
        }
    };

    const executeTask = async (taskPath: string, prompt: string, variables: Record<string, any> = {}) => {
        const parser = createParser({ onEvent: _onParse });
        const payload = { task: taskPath, prompt: prompt, vars: variables };
        if (isVerbose) {
            console.log("Ingesting prompt ...")
        }
        const response = await fetch(url + "/task/execute", {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',
                'Authorization': `Bearer ${params.apiKey}`,
            },
        });
        if (!response?.body) {
            throw new Error("No response")
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        while (true) {
            const result = await reader.read();
            if (result.done) {
                break;
            }
            const chunk = decoder.decode(result.value);
            parser.feed(chunk)
        }
    };

    return {
        executeTask,
        executeCmd,
    }
}

export { useServer }