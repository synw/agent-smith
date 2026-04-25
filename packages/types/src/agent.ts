import type { AllCallbacks } from "./callbacks.js";
import type { LmProvider } from "./lm.js";

interface AgentParams extends AllCallbacks {
    name?: string;
    lm: LmProvider,
}

export {
    AgentParams,
}