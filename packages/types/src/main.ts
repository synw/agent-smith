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

interface WsClientMsg {
    command: string;
    type: WsClientMsgType;
    feature?: FeatureType;
    payload?: any;
    options?: Record<string, any>;
}

interface WsRawClientMsg {
    type: WsClientMsgType;
    msg: string;
}

interface WsRawServerMsg {
    type: WsServerMsgType;
    msg: string;
}

type WsServerMsgType =
    | 'error'
    | 'token'
    | 'turnend'
    | 'assistant'
    | 'toolsturnstart'
    | 'toolsturnend'
    | 'toolcall'
    | 'toolcallend'
    | 'toolcallconfirm'
    | 'finalresult';
type WsClientMsgType = "command" | "system";

type FeatureType = "task" | "agent" | "action" | "cmd" | "workflow" | "adaptater";

export {
    WsClientMsg,
    WsClientMsgType,
    WsServerMsgType,
    FeatureType,
    ToolCallSpec,
    WsRawClientMsg,
    WsRawServerMsg,
}