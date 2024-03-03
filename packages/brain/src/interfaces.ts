import { InferenceParams, InferenceResult, LmProviderType } from "@locallm/types";
import { PromptTemplate } from "modprompt";
import { Lm } from "@locallm/api";
import { MapStore, Store } from "nanostores";

interface LmBackendSpec {
    name: string;
    providerType: LmProviderType;
    serverUrl: string;
    apiKey: string;
    enabled: boolean;
}

interface LmExpertSpec {
    name: string;
    description?: string;
    templateName?: string;
    template?: PromptTemplate;
    localLm?: "koboldcpp" | "llamacpp";
    backend?: LmBackendSpec;
    onToken?: (t: string) => void;
}

interface LmThinkingOptionsSpec {
    verbose?: boolean,
    tsGrammar?: string,
    grammar?: string,
    parseJson?: boolean,
    onToken?: (t: string) => void;
}

interface AgentBrainExpertState {
    isUp: boolean;
    isStreaming: boolean;
    isThinking: boolean;
}

interface AgentBrainState {
    isOn: boolean;
}

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
}

interface AgentBrain {
    stream: Store<string>,
    state: MapStore<AgentBrainState>;
    experts: LmExpert[];
    ex: Readonly<LmExpert>;
    discover: (isVerbose?: boolean) => Promise<boolean>;
    think: ThinkFunctionType;
    thinkx: ThinkxFunctionType;
    abortThinking: () => Promise<void>;
    expert: (name: string) => LmExpert;
}

type ThinkFunctionType = (
    prompt: string,
    inferenceParams?: InferenceParams,
    options?: LmThinkingOptionsSpec
) => Promise<InferenceResult>;

type ThinkxFunctionType = (
    expertName: string,
    prompt: string,
    inferenceParams?: InferenceParams,
    options?: LmThinkingOptionsSpec
) => Promise<InferenceResult>;

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