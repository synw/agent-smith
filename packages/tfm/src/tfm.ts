import { templates } from "modprompt";
import { TemplateForModel } from "./tfminterfaces";

const useTemplateForModel = (): TemplateForModel => {
    const list = () => Object.keys(templates);

    const guess = (model: string): string => {
        const _model = model.toLowerCase();
        if (_model.includes("hermes") || _model.includes("dolphin") || _model.includes("qwen")) {
            return "chatml"
        }
        if (_model.includes("deepseek")) {
            if (_model.includes("v2") || _model.includes("lite")) {
                return "deepseek2"
            }
            return "deepseek"
        }
        if (_model.includes("mistral") || _model.includes("mixtral")) {
            return "mistral"
        }
        if (_model.includes("codestral")) {
            return "codestral"
        }
        if (_model.includes("phi2")) {
            return "phi"
        }
        if (_model.includes("phi3") || _model.includes("phi-3")) {
            return "phi3"
        }
        if (_model.includes("llama3") || _model.includes("llama-3")) {
            return "llama3"
        }
        if (_model.includes("command-r") || _model.includes("aya")) {
            return "command-r"
        }
        if (_model.includes("tinyllama") || _model.includes("zephyr")) {
            return "zephyr"
        }
        if (_model.includes("gemma")) {
            return "gemma"
        }
        return "none"
    };

    return {
        list,
        guess,
    }
}

export { useTemplateForModel }