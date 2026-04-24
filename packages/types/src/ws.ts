import type { FeatureType } from "./task.js";
import type { ToolCallSpec } from "./tools.js";
import type { HistoryTurn, ToolTurn } from "./history.js";
import type { InferenceParams } from "./inference.js";

/**
 * WebSocket client message structure.
 *
 * @interface WsClientMsg
 * @param {string} command - The command to execute.
 * @param {WsClientMsgType} type - The type of message.
 * @param {FeatureType} [feature] - The feature associated with the message.
 * @param {any} [payload] - The message payload.
 * @param {Record<string, any>} [options] - Additional options.
 * @example
 * const message: WsClientMsg = {
 *   command: 'start',
 *   type: 'command',
 *   payload: { sessionId: '123' }
 * };
 */
interface WsClientMsg {
    command: string;
    type: WsClientMsgType;
    feature?: FeatureType;
    payload?: any;
    options?: Record<string, any>;
}

/**
 * Raw WebSocket client message structure.
 *
 * @interface WsRawClientMsg
 * @param {WsClientMsgType} type - The type of message.
 * @param {string} msg - The raw message content.
 * @example
 * const rawMessage: WsRawClientMsg = {
 *   type: 'command',
 *   msg: '{"command": "start", "payload": {}}'
 * };
 */
interface WsRawClientMsg {
    type: WsClientMsgType;
    msg: string;
}

/**
 * Raw WebSocket server message structure.
 *
 * @interface WsRawServerMsg
 * @param {WsServerMsgType} type - The type of message.
 * @param {string} msg - The raw message content.
 * @example
 * const rawMessage: WsRawServerMsg = {
 *   type: 'token',
 *   msg: 'Hello world'
 * };
 */
interface WsRawServerMsg {
    type: WsServerMsgType;
    msg: string;
}

/**
 * Streamed message structure for real-time updates.
 *
 * @interface StreamedMessage
 * @param {string} content - The message content.
 * @param {MsgType} type - The type of message.
 * @param {number} num - Message sequence number.
 * @param {Record<string, any>} [data] - Additional data.
 * @example
 * const streamedMessage: StreamedMessage = {
 *   content: 'Hello',
 *   type: 'token',
 *   num: 1
 * };
 */
interface StreamedMessage {
    content: string;
    type: MsgType;
    num: number;
    data?: Record<string, any>;
}

/**
 * Server parameters for handling WebSocket messages.
 *
 * @interface ServerParams
 * @param {(token: string) => void} onToken - Callback for token events.
 * @param {(msg: string) => void} [onError] - Callback for error messages.
 * @param {(tc: ToolCallSpec) => void} [onToolCall] - Callback for tool calls.
 * @param {(id: string, tr: any) => void} [onToolCallEnd] - Callback for tool call completion.
 * @param {(tc: Array<ToolCallSpec>) => void} [onToolsTurnStart] - Callback for tools turn start.
 * @param {(tr: Array<ToolTurn>) => void} [onToolsTurnEnd] - Callback for tools turn end.
 * @param {(hist: HistoryTurn) => void} [onFinalResult] - Callback for final results.
 * @param {(ht: HistoryTurn) => void} [onTurnEnd] - Callback for turn end.
 * @param {(txt: string) => void} [onAssistant] - Callback for assistant messages.
 * @param {(txt: string) => void} [onThink] - Callback for thinking messages.
 * @param {(tool: ToolCallSpec) => Promise<boolean>} [onConfirmToolUsage] - Callback for tool usage confirmation.
 * @param {(ht: HistoryTurn) => void} [onInferenceResult] - Callback for inference results.
 * @param {string} [url] - Server URL.
 * @param {boolean} [isVerbose] - Whether to enable verbose logging.
 * @param {InferenceParams} [defaultInferenceParams] - Default inference parameters.
 * @example
 * const serverParams: ServerParams = {
 *   onToken: (token) => console.log(token),
 *   onError: (msg) => console.error(msg),
 *   onToolCall: (tc) => console.log('Tool call:', tc),
 *   onFinalResult: (hist) => console.log('Final result:', hist)
 * };
 */
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
    onThink?: (txt: string) => void;
    onConfirmToolUsage?: (tool: ToolCallSpec) => Promise<boolean>;
    onInferenceResult?: (ht: HistoryTurn) => void;
    url?: string;
    isVerbose?: boolean;
    defaultInferenceParams?: InferenceParams,
}







/**
 * WebSocket server message types.
 *
 * @type {WsServerMsgType}
 * @example
 * const msgType: WsServerMsgType = 'token';
 */
type WsServerMsgType = 'error'
    | 'token'
    | 'turnend'
    | 'assistant'
    | 'toolsturnstart'
    | 'toolsturnend'
    | 'toolcall'
    | 'toolcallend'
    | 'toolcallconfirm'
    | 'finalresult'
    | "think";

/**
 * WebSocket client message types.
 *
 * @type {WsClientMsgType}
 * @example
 * const msgType: WsClientMsgType = 'command';
 */
type WsClientMsgType = "command" | "system";

/**
 * Message types.
 *
 * @type {MsgType}
 * @example
 * const msgType: MsgType = 'token';
 */
type MsgType = "token" | "system" | "error";

export {
    WsClientMsg,
    WsClientMsgType,
    WsServerMsgType,
    WsRawClientMsg,
    WsRawServerMsg,
    MsgType,
    ServerParams,
    StreamedMessage,
}