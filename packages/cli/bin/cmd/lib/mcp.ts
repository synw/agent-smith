import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ToolSpec } from "@locallm/types/dist/tools";

class McpClient {
    name: string;
    transport: StdioClientTransport;
    client: Client;
    authorizedTools: Array<string> | null = null;
    tools: Record<string, ToolSpec> = {};

    constructor(servername: string, command: string, args: Array<string>, authorizedTools: Array<string> | null = null) {
        //console.log("MCP servername", servername);
        //console.log("MCP command", command);
        //console.log("MCP ARGS", typeof args, args);
        this.name = servername;
        const okargs = new Array<string>();
        for (const arg of args) {
            let _arg = arg;
            if (arg.startsWith("Authorization:")) {
                const k = `MCP_${servername.toUpperCase()}_AUTH`;
                const v = process.env[k];
                if (!v) {
                    throw new Error(`Env variable ${k} not found for ${servername} mcp auth`)
                }
                _arg = arg.replace("$MCP_AUTH", v)
            }
            okargs.push(_arg)
        }
        this.transport = new StdioClientTransport({
            command: command,
            args: args
        });
        this.client = new Client({ name: "AgentSmith", version: "0.1.0" });
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

    async extractTools(): Promise<Array<ToolSpec>> {
        const toolSpecs = new Array<ToolSpec>();
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
            const exec = async (args: any): Promise<any> => {
                const payload = {
                    name: tool.name,
                    arguments: args,
                };
                //console.log("PAY", payload);
                const res = await this.client.callTool(payload);
                return res
            }
            const t: ToolSpec = {
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
    McpClient,
}