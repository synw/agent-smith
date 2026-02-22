interface ClientMsg {
    command: string;
    type: ClientMsgType;
    payload?: any;
    feature?: FeatureType;
    options?: Record<string, any>;
}

/**
 * Represents a tool call specification.
 *
 * @interface ToolCallSpec
 * @property {string} id - The unique identifier for the tool call.
 * @property {string} name - The name of the tool being called.
 * @property {Record<string, string> | undefined} arguments - The arguments to pass to the tool.
 * @example
 * const toolCall: ToolCallSpec = {
 *   id: '1',
 *   name: 'getWeather',
 *   arguments: { location: 'New York' }
 * };
 */
interface ToolCallSpec {
    id: string;
    name: string;
    arguments?: {
        [key: string]: string;
    };
}

type ClientMsgType = "command" | "system";
type ServerMsgType = "token" | "system" | "error";

type FeatureType = "task" | "agent" | "action" | "cmd" | "workflow" | "adaptater";

export {
    ClientMsg,
    ClientMsgType,
    ServerMsgType,
    FeatureType,
    ToolCallSpec,
}