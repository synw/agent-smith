import type { Reactive, Ref } from "vue";
import type { AgentInferenceOptions, InferenceParams, InferenceResult } from "./inference.js";
import type { ToolCallSpec, ToolDefSpec, ToolSpec } from "./tools.js";
import type { ConfigFile } from "./conf.js";
import type { ModelInfo } from "./model.js";
import type { HistoryTurn, ToolTurn, UiHistoryTurn } from "./history.js";
import type { AllCallbacks } from "./callbacks.js";

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

interface TaskVariableDef {
    type: string | Array<string>; // array is for enums
    description: string;
}

interface TaskOptionalVariableDef extends TaskVariableDef {
    default?: any
}

interface TaskVariables {
    required?: Record<string, TaskVariableDef>;
    optional?: Record<string, TaskOptionalVariableDef>;
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
 * Represents the input configuration for a language model task.
 *
 * @interface TaskInput
 * @param {string} prompt - The user's input prompt for the task.
 */
interface TaskInput {
    prompt: string;
    [key: string]: any;
}

interface TaskVariableDef {
    type: string | Array<string>; // array is for enums
    description: string;
}

interface TaskOptionalVariableDef extends TaskVariableDef {
    default?: any
}

interface TaskVariables {
    required?: Record<string, TaskVariableDef>;
    optional?: Record<string, TaskOptionalVariableDef>;
}

/**
 * Represents a template specification for a language model task.
 *
 * @interface TemplateSpec
 * @param {string} [system] - The system message for the template.
 * @param {Array<string>} [stop] - Extra stop sequences for the template.
 * @param {string} [assistant] - The assistant start message for the template.
 * @example
 * const template: TemplateSpec = {
 *   system: "You are a helpful AI",
 *   stop: ["\n", "</s>"],
 * };
 */
interface TemplateSpec {
    system?: string;
    afterSystem?: string;
    stop?: Array<string>;
    assistant?: string;
}

interface TaskDef {
    name: string;
    prompt: string;
    description: string;
    model: string;
    ctx: number;
    template?: TemplateSpec;
    inferParams?: InferenceParams;
    models?: Array<string>;
    shots?: Array<HistoryTurn>;
    variables?: TaskVariables;
    tools?: Array<ToolSpec>;
    toolsList?: Array<string>;
    type?: string;
    category?: string;
}

/**
 * Feature types.
 *
 * @type {FeatureType}
 * @example
 * const featureType: FeatureType = 'task';
 */
type FeatureType = "task" | "agent" | "action" | "cmd" | "workflow" | "adaptater";

export {
    TaskSettings,
    TaskVariableDef,
    TaskOptionalVariableDef,
    TaskVariables,
    UserTaskVariables,
    TaskService,
    TaskState,
    FeatureType,
    TaskInput,
    TemplateSpec,
    TaskDef,
}