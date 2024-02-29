import { LmProviderType } from "@locallm/types";
import { PromptTemplate } from "modprompt";
import { useLmExpert } from "./lm.js";

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

type LmExpert = ReturnType<typeof useLmExpert>;

export { LmBackendSpec, LmExpertSpec, LmExpert, LmThinkingOptionsSpec }