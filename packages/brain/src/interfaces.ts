import { InferenceParams, InferenceResult, LmProviderType } from "@locallm/types";
import { PromptTemplate } from "modprompt";
import { Lm } from "@locallm/api";
import { MapStore, Store } from "nanostores";

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
 */
interface LmExpertSpec {
    name: string;
    description?: string;
    templateName?: string;
    template?: PromptTemplate;
    localLm?: LmProviderType;
    backend?: LmBackendSpec;
    onToken?: (t: string) => void;
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
 * Represents an expert in the agent's brain.
 * 
 * @property {Store<string>} stream - The stream of output from the expert.
 * @property {string} name - The name of the expert.
 * @property {string} description - The description of the expert.
 * @property {Lm} lm - The local language model.
 * @property {PromptTemplate} template - The prompt template.
 * @property {MapStore<AgentBrainExpertState>} state - The state of the expert.
 * @property {ProbeFunctionType} probe - The function to probe the expert.
 * @property {ThinkFunctionType} think - The function to think with the expert.
 * @property {() => Promise<void>} abortThinking - The function to abort thinking with the expert.
 * @property {(tpl: string | PromptTemplate) => void} setTemplate - The function to set the prompt template.
 * @property {(func: (t: string) => void) => void} setOnToken - The function to set the function to call when a token is generated.
 */
interface LmExpert {
    stream: Store<string>;
    name: string;
    description: string;
    lm: Lm;
    template: PromptTemplate;
    state: MapStore<AgentBrainExpertState>;
    probe: ProbeFunctionType;
    think: ThinkFunctionType;
    abortThinking: () => Promise<void>;
    setTemplate: (tpl: string | PromptTemplate) => void;
    setOnToken: (func: (t: string) => void) => void;
}

/**
 * Represents the agent's brain.
 * 
 * @property {Store<string>} stream - The stream of output from the brain.
 * @property {MapStore<AgentBrainState>} state - The state of the brain.
 * @property {LmExpert[]} experts - The experts in the brain.
 * @property {Readonly<LmExpert>} ex - The current expert.
 * @property {(isVerbose?: boolean) => Promise<boolean>} discover - The function to discover experts.
 * @property {() => Promise<void>} discoverExperts - The function to discover experts.
 * @property {ThinkFunctionType} think - The function to think with the brain.
 * @property {ThinkxFunctionType} thinkx - The function to think with a specific expert.
 * @property {() => Promise<void>} abortThinking - The function to abort thinking with the brain.
 * @property {(name: string) => LmExpert} expert - The function to get a specific expert.
 * @property {() => void} resetExperts - The function to reset the experts.
 */
interface AgentBrain {
    stream: Store<string>,
    state: MapStore<AgentBrainState>;
    experts: LmExpert[];
    ex: Readonly<LmExpert>;
    discover: (isVerbose?: boolean) => Promise<boolean>;
    discoverExperts: () => Promise<void>;
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