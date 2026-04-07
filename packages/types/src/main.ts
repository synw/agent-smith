
import { LmProviderType, type HistoryTurn, type InferenceParams, type ToolDefSpec, type ToolTurn } from "@locallm/types";
import type { TaskVariables } from "@agent-smith/task";
import type { Ref, Reactive } from "vue";

/**
 * Configuration for an inference backend.
 *
 * @interface ConfInferenceBackend
 * @param {LmProviderType} type - The type of language model provider.
 * @param {string} url - The URL of the backend service.
 * @param {string} [apiKey] - The API key for authentication (optional).
 * @example
 * const backend: ConfInferenceBackend = {
 *   type: 'ollama',
 *   url: 'http://localhost:11434',
 *   apiKey: 'my-api-key'
 * };
 */
interface ConfInferenceBackend {
    type: LmProviderType;
    url: string;
    apiKey?: string;
}

/**
 * Entries for backend configurations, supporting different value types.
 *
 * @interface BackendEntries
 * @example
 * const backends: BackendEntries = {
 *   'default': {
 *     type: 'ollama',
 *     url: 'http://localhost:11434'
 *   },
 *   'models': ['llamacpp', 'koboldcpp', 'ollama']
 * };
 */
interface BackendEntries {
    [key: string]: ConfInferenceBackend | string | Array<"llamacpp" | "koboldcpp" | "ollama">;
}

/**
 * Settings for a task configuration.
 *
 * @interface TaskSettings
 * @param {string} [model] - The model to use for the task.
 * @param {string} [template] - The template to use for the task.
 * @param {number} [ctx] - Context window size.
 * @param {number} [max_tokens] - Maximum number of tokens to generate.
 * @param {number} [top_k] - Top-k sampling parameter.
 * @param {number} [top_p] - Top-p sampling parameter.
 * @param {number} [min_p] - Minimum probability for nucleus sampling.
 * @param {number} [temperature] - Sampling temperature.
 * @param {number} [repeat_penalty] - Penalty for repeated tokens.
 * @param {string} [backend] - The backend to use for the task.
 * @example
 * const taskSettings: TaskSettings = {
 *   model: 'llama3',
 *   ctx: 2048,
 *   temperature: 0.7
 * };
 */
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

/**
 * Configuration file structure for the application.
 *
 * @interface ConfigFile
 * @param {string} [promptfile] - Path to the prompt file.
 * @param {string} [datadir] - Directory for data storage.
 * @param {Array<string>} [features] - Enabled features.
 * @param {Array<string>} [plugins] - Loaded plugins.
 * @param {BackendEntries} [backends] - Backend configurations.
 * @param {Record<string, TaskSettings>} [tasks] - Task settings.
 * @param {Record<string, string>} [apps] - Application configurations.
 * @example
 * const config: ConfigFile = {
 *   datadir: './data',
 *   features: ['chat', 'tools'],
 *   backends: {
 *     'default': {
 *       type: 'ollama',
 *       url: 'http://localhost:11434'
 *     }
 *   }
 * };
 */
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
 * @param {string} id - The unique identifier for the tool call.
 * @param {string} name - The name of the tool being called.
 * @param {Record<string, string> | undefined} arguments - The arguments to pass to the tool.
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

/**
 * WebSocket client message structure.
 *
 * @interface WsClientMsg
 * @param {string} command - The command to execute.
 * @param {WsClientMsgType} type - The type of message.
 * @param {FeatureType} [feature] - The feature associated with the message.
 * @param {any} [payload] - The message payload.
 * @param {Record<string, any>} [options] - Additional options.
 * @example
 * const message: WsClientMsg = {
 *   command: 'start',
 *   type: 'command',
 *   payload: { sessionId: '123' }
 * };
 */
interface WsClientMsg {
    command: string;
    type: WsClientMsgType;
    feature?: FeatureType;
    payload?: any;
    options?: Record<string, any>;
}

/**
 * Raw WebSocket client message structure.
 *
 * @interface WsRawClientMsg
 * @param {WsClientMsgType} type - The type of message.
 * @param {string} msg - The raw message content.
 * @example
 * const rawMessage: WsRawClientMsg = {
 *   type: 'command',
 *   msg: '{"command": "start", "payload": {}}'
 * };
 */
interface WsRawClientMsg {
    type: WsClientMsgType;
    msg: string;
}

/**
 * Raw WebSocket server message structure.
 *
 * @interface WsRawServerMsg
 * @param {WsServerMsgType} type - The type of message.
 * @param {string} msg - The raw message content.
 * @example
 * const rawMessage: WsRawServerMsg = {
 *   type: 'token',
 *   msg: 'Hello world'
 * };
 */
interface WsRawServerMsg {
    type: WsServerMsgType;
    msg: string;
}

/**
 * Streamed message structure for real-time updates.
 *
 * @interface StreamedMessage
 * @param {string} content - The message content.
 * @param {MsgType} type - The type of message.
 * @param {number} num - Message sequence number.
 * @param {Record<string, any>} [data] - Additional data.
 * @example
 * const streamedMessage: StreamedMessage = {
 *   content: 'Hello',
 *   type: 'token',
 *   num: 1
 * };
 */
interface StreamedMessage {
    content: string;
    type: MsgType;
    num: number;
    data?: Record<string, any>;
}

/**
 * User task variables with required and optional values.
 *
 * @interface UserTaskVariables
 * @param {Record<string, string>} required - Required variable values.
 * @param {Record<string, string>} optional - Optional variable values.
 * @example
 * const variables: UserTaskVariables = {
 *   values: {
 *     required: { name: 'John' },
 *     optional: { age: '30' }
 *   }
 * };
 */
interface UserTaskVariables extends TaskVariables {
    values: {
        required: Record<string, string>,
        optional: Record<string, string>,
    }
}

/**
 * Service interface for task management.
 *
 * @interface TaskService
 * @param {Ref<boolean>} isReady - Reactive reference indicating if service is ready.
 * @param {Ref<Record<string, any>>} task - Reactive reference to current task.
 * @param {Reactive<UserTaskVariables>} variables - Reactive task variables.
 * @param {Reactive<{ data: InferenceParams }>} inferParams - Reactive inference parameters.
 * @param {Reactive<{ servers: Record<string, any> }>} mcp - Reactive MCP servers.
 * @param {() => Promise<Record<string, any>>} loadModels - Loads available models.
 * @param {() => Promise<Record<string, Record<string, any>>>} loadTaskSettings - Loads task settings.
 * @param {(name: string, isAgent?: boolean) => Promise<void>} load - Loads a specific task.
 * @param {(name: string) => Promise<Record<string, any>>} loadWorkflow - Loads a workflow.
 * @param {() => Promise<Record<string, any>>} loadBackends - Loads backend configurations.
 * @param {(name: string) => Promise<boolean>} setBackend - Sets the active backend.
 * @param {(prompt: string, opts?: Record<string, any>, isAgent?: boolean) => Promise<void>} exec - Executes a prompt.
 * @param {(prompt: string, opts?: Record<string, any>, isAgent?: boolean, isSync?: boolean) => Promise<void>} execSync - Synchronously executes a prompt.
 * @param {() => Promise<void>} cancel - Cancels current execution.
 * @param {(tools: Array<string>) => Promise<Array<{ def: ToolDefSpec, type: string }>>} getTools - Retrieves tool specifications.
 * @param {() => Promise<{ found: boolean, config: ConfigFile }>} checkState - Checks current configuration state.
 * @example
 * const taskService: TaskService = {
 *   isReady: ref(false),
 *   task: ref({}),
 *   variables: reactive({ values: { required: {}, optional: {} } }),
 *   inferParams: reactive({ data: {} }),
 *   mcp: reactive({ servers: {} }),
 *   loadModels: async () => ({}),
 *   loadTaskSettings: async () => ({}),
 *   load: async (name) => {},
 *   loadWorkflow: async (name) => ({}),
 *   loadBackends: async () => ({}),
 *   setBackend: async (name) => true,
 *   exec: async (prompt) => {},
 *   execSync: async (prompt) => {},
 *   cancel: async () => {},
 *   getTools: async (tools) => [],
 *   checkState: async () => ({ found: false, config: {} })
 * };
 */
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

/**
 * Server parameters for handling WebSocket messages.
 *
 * @interface ServerParams
 * @param {(token: string) => void} onToken - Callback for token events.
 * @param {(msg: string) => void} [onError] - Callback for error messages.
 * @param {(tc: ToolCallSpec) => void} [onToolCall] - Callback for tool calls.
 * @param {(id: string, tr: any) => void} [onToolCallEnd] - Callback for tool call completion.
 * @param {(tc: Array<ToolCallSpec>) => void} [onToolsTurnStart] - Callback for tools turn start.
 * @param {(tr: Array<ToolTurn>) => void} [onToolsTurnEnd] - Callback for tools turn end.
 * @param {(hist: HistoryTurn) => void} [onFinalResult] - Callback for final results.
 * @param {(ht: HistoryTurn) => void} [onTurnEnd] - Callback for turn end.
 * @param {(txt: string) => void} [onAssistant] - Callback for assistant messages.
 * @param {(txt: string) => void} [onThink] - Callback for thinking messages.
 * @param {(tool: ToolCallSpec) => Promise<boolean>} [onConfirmToolUsage] - Callback for tool usage confirmation.
 * @param {(ht: HistoryTurn) => void} [onInferenceResult] - Callback for inference results.
 * @param {string} [url] - Server URL.
 * @param {boolean} [isVerbose] - Whether to enable verbose logging.
 * @param {InferenceParams} [defaultInferenceParams] - Default inference parameters.
 * @example
 * const serverParams: ServerParams = {
 *   onToken: (token) => console.log(token),
 *   onError: (msg) => console.error(msg),
 *   onToolCall: (tc) => console.log('Tool call:', tc),
 *   onFinalResult: (hist) => console.log('Final result:', hist)
 * };
 */
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

/**
 * UI history turn with additional state information.
 *
 * @interface UiHistoryTurn
 * @param {HistoryTurn} - Extends HistoryTurn interface.
 * @param {string} from - The source of the turn
 * @param {Object} state - UI state for the turn.
 * @param {boolean} state.showThinking - Whether to show thinking process.
 * @param {Array<string>} state.showToolResponses - Tool responses to show.
 * @param {number | null} state.confirmRestartAtTurn - Turn number to restart at.
 * @param {Record<string, { resolve: (value: boolean) => void, reject: (reason?: any) => void }>} state.confirmToolCalls - Tool call confirmations.
 * @example
 * const uiHistoryTurn: UiHistoryTurn = {
 *   from: 'qwen4b',
 *   assistant: "response here",
 *   state: {
 *     showThinking: true,
 *     showToolResponses: ['tool1'],
 *     confirmRestartAtTurn: null,
 *     confirmToolCalls: {}
 *   }
 * };
 */
interface UiHistoryTurn extends HistoryTurn {
    from: string;
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

/**
 * Model information structure.
 *
 * @interface ModelInfo
 * @param {string} status - The status of the model.
 * @param {number} ctx - Context window size.
 * @example
 * const modelInfo: ModelInfo = {
 *   status: 'loaded',
 *   ctx: 2048
 * };
 */
interface ModelInfo {
    status: string;
    ctx: number;
}

/**
 * Task state management structure.
 *
 * @interface TaskState
 * @param {boolean} isReady - Whether the task is ready.
 * @param {Promise<boolean>} onReady - Promise that resolves when ready.
 * @param {boolean} hasConfig - Whether configuration exists.
 * @param {Array<UiHistoryTurn>} history - History of turns.
 * @param {Record<string, ModelInfo>} models - Available models.
 * @param {Record<string, Record<string, any>>} tasksSettings - Task settings.
 * @param {Record<string, Record<string, any>>} backends - Backend configurations.
 * @param {Object} currentFeature - Current feature information.
 * @param {string} currentFeature.name - Feature name.
 * @param {string} currentFeature.type - Feature type.
 * @example
 * const taskState: TaskState = {
 *   isReady: false,
 *   onReady: Promise.resolve(false),
 *   hasConfig: false,
 *   history: [],
 *   models: {},
 *   tasksSettings: {},
 *   backends: {},
 *   currentFeature: { name: 'chat', type: 'task' }
 * };
 */
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

/**
 * WebSocket server message types.
 *
 * @type {WsServerMsgType}
 * @example
 * const msgType: WsServerMsgType = 'token';
 */
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

/**
 * WebSocket client message types.
 *
 * @type {WsClientMsgType}
 * @example
 * const msgType: WsClientMsgType = 'command';
 */
type WsClientMsgType = "command" | "system";

/**
 * Message types.
 *
 * @type {MsgType}
 * @example
 * const msgType: MsgType = 'token';
 */
type MsgType = "token" | "system" | "error";

/**
 * Feature types.
 *
 * @type {FeatureType}
 * @example
 * const featureType: FeatureType = 'task';
 */
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
