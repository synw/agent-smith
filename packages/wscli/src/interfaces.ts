import type { HistoryTurn, ToolTurn } from "@locallm/types";
import type { ToolCallSpec } from "../../types/dist/main";

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
    onConfirmToolUsage?: (tool: ToolCallSpec) => Promise<boolean>;
    onInferenceResult?: (ht: HistoryTurn) => void;
    url?: string;
    isVerbose?: boolean;
}

interface StreamedMessage {
    content: string;
    type: MsgType;
    num: number;
    data?: Record<string, any>;
}

type MsgType = "token" | "system" | "error";

export {
    ServerParams,
    StreamedMessage,
}