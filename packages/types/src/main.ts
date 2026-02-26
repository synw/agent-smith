import { LmProviderType } from "@locallm/types";

interface ConfInferenceBackend {
    type: LmProviderType;
    url: string;
    apiKey?: string;
}

interface BackendEntries {
    [key: string]: ConfInferenceBackend | string | Array<"llamacpp" | "koboldcpp" | "ollama">;
}

interface TaskSettings {
    model?: string;
    template?: string;
    ctx?: number;
    max_tokens?: number;
    top_k?: number;
    top_p?: number;
    min_p?: number;
    temperature?: number;
    repeat_penalty?: number;
    backend?: string;
}

interface ConfigFile {
    promptfile?: string;
    datadir?: string;
    features?: Array<string>;
    plugins?: Array<string>;
    backends?: BackendEntries;
    tasks?: Record<string, TaskSettings>;
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

type WsServerMsgType = 'error'
    | 'token'
    | 'turnend'
    | 'assistant'
    | 'toolsturnstart'
    | 'toolsturnend'
    | 'toolcall'
    | 'toolcallend'
    | 'toolcallconfirm'
    | 'finalresult'
    | "think";
type WsClientMsgType = "command" | "system";

type FeatureType = "task" | "agent" | "action" | "cmd" | "workflow" | "adaptater";

export {
    ConfigFile,
    TaskSettings,
    BackendEntries,
    ConfInferenceBackend,
    WsClientMsg,
    WsClientMsgType,
    WsServerMsgType,
    FeatureType,
    ToolCallSpec,
    WsRawClientMsg,
    WsRawServerMsg,
}