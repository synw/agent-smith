import { useTmem } from "@agent-smith/tmem";
import { templates } from "modprompt";

const useTemplateForModel = () => {
    const tmem = useTmem("templateForModel", {});

    const set = async (template: string, model: string) => await tmem.set(model, template);

    const get = async (model: string) => await tmem.get<string>(model)

    const list = () => Object.keys(templates);

    const guess = (model: string): string => {
        if (model.includes("deepseek")) {
            return "deepseek"
        }
        if (model.includes("hermes") || model.includes("dolphin")) {
            return "chatml"
        }
        if (model.includes("mistral") || model.includes("mixtral")) {
            return "mistral"
        }
        if (model.includes("phi2")) {
            return "phi"
        }
        if (model.includes("tinyllama")) {
            return "zephyr"
        }
        return "none"
    }

    return {
        get,
        set,
        list,
        guess,
    }
}

export { useTemplateForModel }