import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { LmTaskToolSpec } from "@agent-smith/lmtask/dist/interfaces.js";

class McpServer {
    transport: StdioClientTransport;
    client: Client;
    authorizedTools: Array<string> | null = null;

    constructor(command: string, args: Array<string>, authorizedTools = new Array<string>) {
        this.transport = new StdioClientTransport({
            command: command,
            args: args
        });
        this.client = new Client({ name: "AgentSmith", version: "1.0.0" });
        if (authorizedTools) {
            this.authorizedTools = authorizedTools;
        }
    }

    async start() {
        await this.client.connect(this.transport);
    }

    async stop() {
        await this.client.close()
    }

    async extractTools(): Promise<Array<LmTaskToolSpec>> {
        const toolSpecs = new Array<LmTaskToolSpec>();
        const serverToolsList = await this.client.listTools();
        //await this.stop();
        for (const tool of serverToolsList.tools) {
            if (this.authorizedTools) {
                if (!this.authorizedTools.includes(tool.name)) {
                    continue
                }
            }
            const args: { [key: string]: { description: string } } = {};
            if (tool.inputSchema.properties) {
                for (const [k, v] of Object.entries(tool.inputSchema.properties)) {
                    const vv = v as Record<string, any>;
                    args[k] = { description: vv.description + " (" + vv.type + ")" }
                }
            }
            const exec = async <O = Record<string, any>>(args: Record<string, any>): Promise<O> => {
                //await this.start();
                const res = await this.client.callTool({
                    name: tool.name,
                    arguments: args,
                });
                //this.stop();
                return res as O
            }
            const t: LmTaskToolSpec = {
                name: tool.name,
                description: tool.description ?? "",
                arguments: args,
                execute: exec
            }
            toolSpecs.push(t)
        }
        return toolSpecs
    }
}

export {
    McpServer,
}