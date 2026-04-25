import type { HistoryTurn, ToolTurn } from "./history.js";
import type { InferenceResult } from "./inference.js";
import type { IngestionStats } from "./stats.js";
import type { ToolCallSpec } from "./tools.js";

interface InferenceCallbacks {
    onToken?: (t: string) => void;
    onThinkingToken?: (t: string) => void;
    onStartEmit?: (data: IngestionStats) => void;
    onEndEmit?: (result: InferenceResult) => void;
    onError?: (err: string) => void;
    onToolCallInProgress?: (tc: Array<ToolCallSpec>) => void;
}

interface AgentCallbacks {
    onToolCall?: (tc: ToolCallSpec) => void;
    onToolCallEnd?: (id: string, tr: any) => void;
    onToolsTurnStart?: (tc: Array<ToolCallSpec>) => void;
    onToolsTurnEnd?: (tt: Array<ToolTurn>) => void;
    onTurnEnd?: (ht: HistoryTurn) => void;
    onAssistant?: (txt: string) => void;
    onThink?: (txt: string) => void;
}

interface AllCallbacks extends InferenceCallbacks, AgentCallbacks { }

export {
    InferenceCallbacks,
    AgentCallbacks,
    AllCallbacks,
}