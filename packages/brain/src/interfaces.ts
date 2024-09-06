import { InferenceParams, InferenceResult, LmProviderType } from "@locallm/types";
import { PromptTemplate } from "modprompt";
import { Lm } from "@locallm/api";
import { MapStore, Store } from "nanostores";
import { WllamaProvider } from "@locallm/browser";

/**
 * Specifies the configuration for a local language model backend.
 * 
 * @property {string} name - The name of the backend.
 * @property {LmProviderType} providerType - The type of the backend.
 * @property {string} serverUrl - The URL of the backend server.
 * @property {string} apiKey - The API key for the backend.
 * @property {boolean} enabled - Whether the backend is enabled.
 */
interface LmBackendSpec {
    name: string;
    providerType: LmProviderType;
    serverUrl: string;
    apiKey: string;
    enabled: boolean;
}

/**
 * Specifies the configuration for a local language model expert.
 * 
 * @property {string} name - The name of the expert.
 * @property {string} [description] - The description of the expert.
 * @property {string} [templateName] - The name of the prompt template.
 * @property {PromptTemplate} [template] - The prompt template.
 * @property {LmProviderType} [localLm] - The local language model.
 * @property {LmBackendSpec} [backend] - The backend configuration.
 * @property {(t: string) => void} [onToken] - The function to call when a token is generated.
 * @property {() => void} [onStartEmit] - The function to call just before the first token is generated.
 */
interface LmExpertSpec {
    name: string;
    description?: string;
    templateName?: string;
    template?: PromptTemplate;
    localLm?: LmProviderType;
    backend?: LmBackendSpec;
    onToken?: (t: string) => void;
    onStartEmit?: () => void;
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
 * @property {boolean} isUp - Whether the expert is up and running.
 * @property {boolean} isStreaming - Whether the expert is currently streaming.
 * @property {boolean} isThinking - Whether the expert is currently thinking.
 */
interface AgentBrainExpertState {
    isUp: boolean;
    isStreaming: boolean;
    isThinking: boolean;
}

/**
 * Represents the state of the agent's brain.
 * 
 * @property {boolean} isOn - Whether the agent's brain is currently on.
 */
interface AgentBrainState {
    isOn: boolean;
}

/**
 * Represents an expert in the system with various properties and methods to interact with it.
 * @interface LmExpert
 * @property {Store<string>} stream - The stream of data, typically a string representation.
 * @property {string} name - The name of the expert.
 * @property {string} description - A brief description or summary of the expert's role and capabilities.
 * @property {Lm | WllamaProvider} lm - The language model provider or implementation, which can be either an Lm or a WllamaProvider instance.
 * @property {PromptTemplate} template - The prompt template used for generating prompts to the language model.
 * @property {MapStore<AgentBrainExpertState>} state - A store of states specific to this expert, represented as key-value pairs where each value is an AgentBrainExpertState object.
 * @property {ProbeFunctionType} probe - A function type representing how the expert probes or gathers information from external sources.
 * @property {ThinkFunctionType} think - A function type representing how the expert thinks and processes data, possibly generating responses based on its capabilities.
 * @property {() => Promise<void>} abortThinking - A method to manually abort any ongoing thinking process, returning a promise that resolves when the abortion is complete.
 * @property {(tpl: string | PromptTemplate) => void} setTemplate - Sets or updates the template for generating prompts. Accepts either a string or a PromptTemplate as an argument.
 * @property {(func: (t: string) => void) => void} setOnToken - Registers a callback function to be executed whenever a new token is emitted during thinking or processing.
 * @property {(func: () => void) => void} setOnStartEmit - Registers a callback function to be executed when the expert starts emitting any data, such as thoughts or results.
 */
interface LmExpert {
    stream: Store<string>;
    name: string;
    description: string;
    lm: Lm | WllamaProvider;
    template: PromptTemplate;
    state: MapStore<AgentBrainExpertState>;
    probe: ProbeFunctionType;
    think: ThinkFunctionType;
    abortThinking: () => Promise<void>;
    setTemplate: (tpl: string | PromptTemplate) => void;
    setOnToken: (func: (t: string) => void) => void;
    setOnStartEmit: (func: () => void) => void;
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
 *  @param {boolean} [isVerbose] - Whether to enable verbose mode.
 *  @returns {Promise<boolean>} - Whether the discovery was successful.
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
 */
interface AgentBrain {
    stream: Store<string>,
    state: MapStore<AgentBrainState>;
    experts: Readonly<LmExpert[]>;
    ex: Readonly<LmExpert>;
    expertsForModels: Readonly<Record<string, string>>;
    init: (isVerbose?: boolean) => Promise<boolean>;
    initLocal: (isVerbose?: boolean) => Promise<boolean>;
    discover: (isVerbose?: boolean) => Promise<boolean>;
    discoverLocal: (isVerbose?: boolean) => Promise<boolean>;
    discoverBrowser: (isVerbose?: boolean) => Promise<boolean>;
    expertsForModelsInfo: () => Promise<Record<string, string>>;
    setDefaultExpert: (ex: LmExpert | string) => void;
    getExpertForModel: (model: string) => string | null;
    think: ThinkFunctionType;
    thinkx: ThinkxFunctionType;
    abortThinking: () => Promise<void>;
    expert: (name: string) => LmExpert;
    resetExperts: () => void;
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

export {
    LmBackendSpec,
    LmExpertSpec,
    LmExpert,
    LmThinkingOptionsSpec,
    ThinkFunctionType,
    ProbeFunctionType,
    AgentBrain,
    AgentBrainExpertState,
    AgentBrainState,
}