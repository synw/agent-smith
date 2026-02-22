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
    confirmToolUsage?: (tool: ToolCallSpec) => Promise<boolean>;
    url?: string;
    isVerbose?: boolean;
    format?: FormatType,
}

interface StreamedMessage {
    content: string;
    type: MsgType;
    num: number;
    data?: Record<string, any>;
}

type MsgType = "token" | "system" | "error";
type FormatType = "text" | "html";

export {
    ServerParams,
    StreamedMessage,
    FormatType,
}