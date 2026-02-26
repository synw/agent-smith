import { templates } from "modprompt";
import { TemplateForModel } from "./tfminterfaces.js";

const useTemplateForModel = (): TemplateForModel => {
    const list = () => Object.keys(templates);

    const guess = (model: string, tools: boolean = false): string => {
        const _model = model.toLowerCase();
        switch (true) {
            case _model.includes("deephermes"):
                return "llama3"
            case _model.includes("hermes") || _model.includes("dolphin"):
                return "chatml";
            case _model.includes("qwen"):
                let n = "chatml";
                if (tools) {
                    n = "chatml-tools";
                    if (_model.includes("coder") || _model.includes("next") || _model.includes("3.5")) {
                        n = "chatml-xmltools";
                    }
                }
                return n
            case _model.includes("deepseek"):
                return "deepseek3";
            case _model.includes("mistral") || _model.includes("mixtral") || _model.includes("ministral"):
                return "mistral-system";
            case _model.includes("codestral"):
                return "codestral";
            case _model.includes("phi2"):
                return "phi";
            case _model.includes("phi3") || _model.includes("phi-3"):
                return "phi3";
            case _model.includes("phi4") || _model.includes("phi-4"):
                return "phi4";
            case _model.includes("llama3") || _model.includes("llama-3"):
                return "llama3";
            case _model.includes("command-r") || _model.includes("aya"):
                return "command-r";
            case _model.includes("gemma"):
                return "gemma";
            case _model.includes("granite"):
                return "granite";
            case _model.includes("nemotron"):
                return "nemotron";
            case _model.includes("exaone"):
                return "exaone";
            case _model.includes("ling"):
                return "ling";
            case _model.includes("lfm"):
                return "lfm";
            case _model.includes("minimax"):
                return "minimax";
            case _model.includes("glm"):
                if (tools) {
                    return "glm-tools"
                }
                return "glm";
            case (_model.includes("gpt") && _model.includes("oss")):
                return "gptoss";
            case _model.includes("aescoder"):
                return "chatml";
            default:
                return "none";
        }
    };

    return {
        list,
        guess,
    }
}

export { useTemplateForModel }