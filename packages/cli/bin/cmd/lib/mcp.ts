import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { LmTaskToolSpec } from "@agent-smith/lmtask/dist/interfaces.js";

class McpServer {
    transport: StdioClientTransport;
    client: Client;
    authorizedTools: Array<string> | null = null;
    tools: Record<string, LmTaskToolSpec> = {};

    constructor(command: string, args: Array<string>, authorizedTools: Array<string> | null = null) {
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
                const payload = {
                    name: tool.name,
                    arguments: args,
                };
                //console.log("PAY", payload);
                const res = await this.client.callTool(payload);
                return res as O
            }
            const t: LmTaskToolSpec = {
                name: tool.name,
                description: tool.description ?? "",
                arguments: args,
                execute: exec
            }
            this.tools[tool.name] = t;
            toolSpecs.push(t)
        }
        return toolSpecs
    }
}

export {
    McpServer,
}