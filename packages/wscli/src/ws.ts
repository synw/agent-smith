import type { ServerParams } from "./interfaces.js";
import type { WsClientMsg, FeatureType, ToolCallSpec, WsRawServerMsg } from "@agent-smith/types";
import { HistoryTurn } from "@locallm/types";

const useWsServer = (params: ServerParams) => {
    //console.log("WS PARAMS", params);
    let url = "ws://localhost:5184/ws";
    if (params?.url) {
        url = params.url;
    }
    const ws = new WebSocket(url);
    let onToken = params.onToken;
    let onToolCall = params.onToolCall;
    let onToolCallEnd = params.onToolCallEnd;
    let onToolsTurnStart = params.onToolsTurnStart;
    let onToolsTurnEnd = params.onToolsTurnEnd;
    let onTurnEnd = params.onTurnEnd;
    let onAssistant = params.onAssistant;
    let onError = params.onError;
    let onConfirmToolUsage = params.onConfirmToolUsage;

    ws.onopen = function(event) {
        console.log('Connected to WebSocket server');
    };

    ws.onmessage = function(event: MessageEvent) {
        //console.log('Received message:', typeof event.data, event.data);
        let data: WsRawServerMsg;
        try {
            data = JSON.parse(event.data) as WsRawServerMsg;
        } catch (e) {
            throw new Error(`can not parse data: ${e}\nMSG: ${event.data}`)
        }
        const type = data.type;
        const msg = data.msg;
        /*const s = event.data.split(sep);
        const type = s[0];
        const msg = s[1];
        if (type != "token") {
            console.log(type, msg)
        }*/
        switch (type) {
            case "error":
                if (onError) {
                    onError(msg)
                } else {
                    console.error(msg)
                }
                break;
            case "token":
                onToken(msg);
                break
            case "turnend":
                if (onTurnEnd) {
                    onTurnEnd(JSON.parse(msg))
                }
                break
            case "assistant":
                if (onAssistant) {
                    onAssistant(msg)
                }
                break
            case "toolsturnstart":
                if (onToolsTurnStart) {
                    onToolsTurnStart(JSON.parse(msg))
                }
                break
            case "toolsturnend":
                if (onToolsTurnEnd) {
                    onToolsTurnEnd(JSON.parse(msg))
                }
                break
            case "toolcall":
                if (onToolCall) {
                    onToolCall(JSON.parse(msg))
                }
                break
            case "toolcallend":
                if (onToolCallEnd) {
                    const m = msg.split("<|xtool_call_id|>");
                    const id = m[0];
                    const content = m[1];
                    onToolCallEnd(id, content)
                }
                break
            case "toolcallconfirm":
                if (onConfirmToolUsage) {
                    const tm = JSON.parse(msg) as ToolCallSpec;
                    onConfirmToolUsage(tm).then(c => {
                        const m: WsClientMsg = {
                            type: "system",
                            command: "confirmtool",
                            payload: { confirm: c, id: tm.id }
                        }
                        _sendMsg(JSON.stringify(m))
                    })
                }
                break
            case "finalresult":
                //console.log("FINAL RES", msg);
                const history = JSON.parse(msg) as HistoryTurn;
                //console.log("HIST", history);
                if (params?.onFinalResult) {
                    params.onFinalResult(history)
                }
                break
            default:
                throw new Error(`unknown message type ${type}`)
        }
    };

    ws.onclose = function(event) {
        console.log('Disconnected from WebSocket server');
    };

    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

    const _sendMsg = (m: string) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(m);
        } else {
            console.warn('Cannot send message - not connected');
        }
    }

    const _executeFeature = async (name: string, feat: FeatureType, payload: any, options: Record<string, any> = {}) => {
        const cmd: WsClientMsg = {
            type: "command",
            command: name,
            feature: feat,
            payload: payload,
            options: options,
        };
        _sendMsg(JSON.stringify(cmd));
    };

    const executeTask = async (
        name: string, payload: any, options: Record<string, any> = {}
    ) => _executeFeature(name, "task", payload, options);

    const executeWorkflow = async (
        name: string, payload: any, options: Record<string, any> = {}
    ) => _executeFeature(name, "workflow", payload, options);

    const executeAgent = async (
        name: string, payload: any, options: Record<string, any> = {}
    ) => _executeFeature(name, "agent", payload, options);

    const cancel = async () => {
        const cmd: WsClientMsg = {
            type: "system",
            command: "stop",
        };
        _sendMsg(JSON.stringify(cmd));
    }

    return {
        executeTask,
        executeWorkflow,
        executeAgent,
        cancel,
        onToken,
        onToolCall,
        onToolCallEnd,
        onError,
        onConfirmToolUsage,
    }
}

export {
    useWsServer,
}