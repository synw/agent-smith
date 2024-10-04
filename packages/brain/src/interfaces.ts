import { InferenceParams, InferenceResult, LmProviderType, ModelConf, OnLoadProgress } from "@locallm/types";
import { PromptTemplate } from "modprompt";
import { Lm } from "@locallm/api";
import { MapStore, Store } from "nanostores";
import { WllamaProvider } from "@locallm/browser";

interface LmExpertSpec {
    name: string;
    backend: LmBackend;
    model: ModelConf;
    template: PromptTemplate | string;
    description?: string;
}

interface LmBackendSpec {
    name: string;
    providerType?: LmProviderType;
    description?: string;
    serverUrl?: string;
    apiKey?: string;
    localLm?: LmProviderType;
    onToken?: (t: string) => void;
    onStartEmit?: () => void;
    extra?: Record<string, any>;
}

/**
 * Specifies the options for thinking with a local language model.
 * 
 * @property {boolean} [verbose] - Whether to enable verbose mode.
 * @property {string} [tsGrammar] - The TypeScript grammar to use.
 * @property {string} [grammar] - The grammar to use.
 * @property {boolean} [parseJson] - Whether to parse the output as JSON.
 * @property {(t: string) => void} [onToken] - The function to call when a token is generated.
 */
interface LmThinkingOptionsSpec {
    verbose?: boolean,
    tsGrammar?: string,
    grammar?: string,
    parseJson?: boolean,
    skipTemplate?: boolean,
    onToken?: (t: string) => void;
}

/**
 * Represents the state of an expert in the agent's brain.
 * 
 * @property {boolean} isReady - Whether the expert is up and running.
 * @property {boolean} isAvailable - The expert is available but the model is not loaded.
 * @property {boolean} isStreaming - Whether the expert is currently streaming.
 * @property {boolean} isThinking - Whether the expert is currently thinking.
 */
interface ExpertState {
    status: ExpertStatus;
    isStreaming: boolean;
    isThinking: boolean;
}

interface BackendState {
    isUp: boolean;
}

/**
 * Represents the state of the agent's brain.
 * 
 * @property {boolean} isOn - Whether the agent's brain is currently on.
 */
interface BrainState {
    isOn: boolean;
}


interface LmExpert {
    stream: Store<string>;
    name: string;
    description: string;
    readonly backend: LmBackend;
    readonly model: ModelConf;
    readonly template: PromptTemplate;
    state: MapStore<ExpertState>;
    lm: Lm | WllamaProvider;
    think: ThinkFunctionType;
    abortThinking: () => Promise<void>;
    setTemplate: (tpl: string | PromptTemplate) => void;
    setModel: (m: ModelConf) => void;
    checkStatus: () => void;
    loadModel: (onLoadProgress?: OnLoadProgress) => Promise<void>;
}

interface LmBackend {
    stream: Store<string>;
    name: string;
    description: string;
    lm: Lm | WllamaProvider;
    state: MapStore<BackendState>;
    probe: ProbeFunctionType;
    setOnToken: (func: (t: string) => void) => void;
    setOnStartEmit: (func: () => void) => void;
    resetStream: () => void;
}


/**
 * Represents the agent's brain.
 * 
 * This interface provides the main functionality of the agent's brain, which includes:
 * - Initialization of the brain and its local experts.
 * - Discovery of experts.
 * - Streaming of output from the experts.
 * - Thinking with the experts.
 * - Aborting thinking with the experts.
 * - Getting a specific expert.
 * - Resetting the experts.
 * - Adding and removing experts.
 * 
 *  @property {Store<string>} stream - The stream of output from the brain.
 *  @property {MapStore<AgentBrainState>} state - The state of the brain.
 *  @property {Readonly<LmExpert[]>} experts - The experts in the brain.
 *  @property {Readonly<LmExpert>} ex - The current expert.
 *  @property {Readonly<Record<string, string>>} expertsForModels - The mapping of models to experts.
 * 
 *  @method init
 *  Initializes the brain and its local experts.
 *  @param {boolean} [isVerbose] - Whether to enable verbose mode.
 *  @returns {Promise<boolean>} - Whether the initialization was successful.
 * 
 *  @method initLocal
 *  Initializes the local experts.
 *  @param {boolean} [isVerbose] - Whether to enable verbose mode.
 *  @returns {Promise<boolean>} - Whether the initialization was successful.
 * 
 *  @method discover
 *  Discovers experts.
 *  @param {boolean} [isVerbose] - Whether to enable verbose mode.
 *  @returns {Promise<boolean>} - Whether the discovery was successful.
 * 
 *  @method discoverLocal
 *  Discovers local experts.
 *  @param {boolean} [setState] - Mutate the state: set experts
 *  @param {boolean} [isVerbose] - Whether to enable verbose mode.
 *  @returns {Promise<Array<LmExpert>>} - Found experts
 * 
 *  @method discoverBrowser
 *  Discovers in browser expert.
 *  @param {boolean} [isVerbose] - Whether to enable verbose mode.
 *  @returns {Promise<boolean>} - Whether the discovery was successful.
 * 
 *  @method expertsForModelsInfo
 *  Retrieves information about the mapping of models to experts.
 *  @returns {Promise<void>} - A promise that resolves when the information is retrieved.
 * 
 *  @method getExpertForModel
 *  Retrieves a specific expert for a given model.
 *  @param {string} model - The name of the model.
 *  @returns {string | null} - The name of the expert, or null if no expert is found.
 * 
 *  @method think
 *  Allows the brain to think with a given prompt, inference parameters, and options.
 *  @param {string} prompt - The prompt to think with.
 *  @param {InferenceParams} [inferenceParams] - The inference parameters.
 *  @param {LmThinkingOptionsSpec} [options] - The thinking options.
 *  @returns {Promise<InferenceResult>} - The result of the thinking.
 * 
 *  @method thinkx
 *  Allows a specific expert to think with a given prompt, inference parameters, and options.
 *  @param {string} expertName - The name of the expert.
 *  @param {string} prompt - The prompt to think with.
 *  @param {InferenceParams} [inferenceParams] - The inference parameters.
 *  @param {LmThinkingOptionsSpec} [options] - The thinking options.
 *  @returns {Promise<InferenceResult>} - The result of the thinking.
 * 
 *  @method abortThinking
 *  Aborts thinking with the current expert.
 *  @returns {Promise<void>} - A promise that resolves when thinking is aborted.
 * 
 *  @method expert
 *  Retrieves a specific expert by name.
 *  @param {string} name - The name of the expert.
 *  @returns {LmExpert} - The expert.
 * 
 *  @method resetExperts
 *  Resets the experts to their initial state.
 * 
 *  @method addExpert
 *  Adds a new expert to the brain.
 *  @param {LmExpert} ex - The expert to add.
 * 
 *  @method removeExpert
 *  Removes an expert from the brain by name.
 *  @param {string} name - The name of the expert to remove.
 */
interface AgentBrain {
    stream: Store<string>,
    state: MapStore<BrainState>;
    readonly experts: Readonly<LmExpert[]>;
    readonly ex: Readonly<LmExpert>;
    readonly backendsForModels: Readonly<Record<string, string>>;
    readonly backends: Array<LmBackend>;
    init: (isVerbose?: boolean) => Promise<boolean>;
    initLocal: (isVerbose?: boolean) => Promise<boolean>;
    discover: (isVerbose?: boolean) => Promise<boolean>;
    discoverLocal: (setState?: boolean, isVerbose?: boolean) => Promise<Array<LmBackend>>;
    discoverBrowser: (isVerbose?: boolean) => Promise<boolean>;
    backendsForModelsInfo: () => Promise<Record<string, string>>;
    setDefaultExpert: (ex: LmExpert | string) => void;
    getBackendForModel: (model: string) => string | null;
    think: ThinkFunctionType;
    thinkx: ThinkxFunctionType;
    abortThinking: () => Promise<void>;
    expert: (name: string) => LmExpert;
    resetExperts: () => void;
    addExpert: (ex: LmExpert) => void;
    removeExpert: (name: string) => void;
    getOrCreateExpertForModel: (modelName: string, templateName: string) => LmExpert | null;
    getExpertForModel: (modelName: string) => LmExpert | null;
    workingExperts: () => Array<LmExpert>;
    backend: (name: string) => LmBackend;
    addBackend: (ex: LmBackend) => void;
    removeBackend: (name: string) => void;
}

/**
 * Represents a function to think with a local language model.
 * 
 * @param {string} prompt - The prompt to think with.
 * @param {InferenceParams} [inferenceParams] - The inference parameters.
 * @param {LmThinkingOptionsSpec} [options] - The thinking options.
 * @returns {Promise<InferenceResult>} - The result of the thinking.
 */
type ThinkFunctionType = (
    prompt: string,
    inferenceParams?: InferenceParams,
    options?: LmThinkingOptionsSpec
) => Promise<InferenceResult>;

/**
 * Represents a function to think with a specific expert in the agent's brain.
 * 
 * @param {string} expertName - The name of the expert.
 * @param {string} prompt - The prompt to think with.
 * @param {InferenceParams} [inferenceParams] - The inference parameters.
 * @param {LmThinkingOptionsSpec} [options] - The thinking options.
 * @returns {Promise<InferenceResult>} - The result of the thinking.
 */
type ThinkxFunctionType = (
    expertName: string,
    prompt: string,
    inferenceParams?: InferenceParams,
    options?: LmThinkingOptionsSpec
) => Promise<InferenceResult>;

/**
 * Represents a function to probe a local language model expert.
 * 
 * @param {boolean} [isVerbose] - Whether to enable verbose mode.
 * @returns {Promise<boolean>} - Whether the expert is up and running.
 */
type ProbeFunctionType = (isVerbose?: boolean) => Promise<boolean>;

type ExpertStatus = "unavailable" | "available" | "ready";

export {
    LmBackendSpec,
    LmExpertSpec,
    LmExpert,
    LmBackend,
    LmThinkingOptionsSpec,
    ThinkFunctionType,
    ProbeFunctionType,
    AgentBrain,
    ExpertState,
    BrainState,
    BackendState,
    ExpertStatus,
}