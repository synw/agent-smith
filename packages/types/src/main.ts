import { LmProviderType, type HistoryTurn, type InferenceParams, type ToolDefSpec, type ToolTurn } from "@locallm/types";
import type { TaskVariables } from "@agent-smith/task";
import type { Ref, Reactive } from "vue";

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
    apps?: Record<string, string>;
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

interface StreamedMessage {
    content: string;
    type: MsgType;
    num: number;
    data?: Record<string, any>;
}

interface UserTaskVariables extends TaskVariables {
    values: {
        required: Record<string, string>,
        optional: Record<string, string>,
    }
}

interface TaskService {
    isReady: Ref<boolean>;
    task: Ref<Record<string, any>>;
    variables: Reactive<UserTaskVariables>;
    inferParams: Reactive<{ data: InferenceParams }>;
    mcp: Reactive<{ servers: Record<string, any> }>;
    loadModels: () => Promise<Record<string, any>>;
    loadTaskSettings: () => Promise<Record<string, Record<string, any>>>;
    load: (name: string, isAgent?: boolean) => Promise<void>;
    loadWorkflow: (name: string) => Promise<Record<string, any>>;
    loadBackends: () => Promise<Record<string, any>>;
    setBackend: (name: string) => Promise<boolean>;
    exec: (prompt: string, opts?: Record<string, any>, isAgent?: boolean) => Promise<void>;
    execSync: (prompt: string, opts?: Record<string, any>, isAgent?: boolean, isSync?: boolean) => Promise<void>;
    cancel: () => Promise<void>;
    getTools: (tools: Array<string>) => Promise<Array<{ def: ToolDefSpec, type: string }>>;
    checkState: () => Promise<{ found: boolean, config: ConfigFile }>;
}

interface ServerParams {
    onToken: (token: string) => void;
    onError?: (msg: string) => void;
    onToolCall?: (tc: ToolCallSpec) => void;
    onToolCallEnd?: (id: string, tr: any) => void;
    onToolsTurnStart?: (tc: Array<ToolCallSpec>) => void;
    onToolsTurnEnd?: (tr: Array<ToolTurn>) => void;
    onFinalResult?: (hist: HistoryTurn) => void;
    onTurnEnd?: (ht: HistoryTurn) => void;
    onAssistant?: (txt: string) => void;
    onThink?: (txt: string) => void;
    onConfirmToolUsage?: (tool: ToolCallSpec) => Promise<boolean>;
    onInferenceResult?: (ht: HistoryTurn) => void;
    url?: string;
    isVerbose?: boolean;
    defaultInferenceParams?: InferenceParams,
}

interface UiHistoryTurn extends HistoryTurn {
    state: {
        showThinking: boolean;
        showToolResponses: Array<string>;
        confirmRestartAtTurn: number | null;
        confirmToolCalls: Record<string, {
            resolve: (value: boolean) => void,
            reject: (reason?: any) => void
        }>;
    }
}

interface ModelInfo {
    status: string;
    ctx: number;
}

interface TaskState {
    isReady: boolean,
    onReady: Promise<boolean>,
    hasConfig: boolean,
    history: Array<UiHistoryTurn>,
    models: Record<string, ModelInfo>,
    tasksSettings: Record<string, Record<string, any>>,
    backends: Record<string, Record<string, any>>,
    currentFeature: { name: string, type: string },
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
type MsgType = "token" | "system" | "error";
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
    MsgType,
    ServerParams,
    StreamedMessage,
    TaskService,
    TaskState,
    UserTaskVariables,
    ModelInfo,
    UiHistoryTurn,
}