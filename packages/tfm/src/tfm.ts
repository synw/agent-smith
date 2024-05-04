import { useTmem } from "@agent-smith/tmem";
import { templates } from "modprompt";
import { TemplateForModel } from "./tfminterfaces";

const useTemplateForModel = (): TemplateForModel => {
    const tmem = useTmem("templateForModel", {});

    const set = async (template: string, model: string) => await tmem.set(model, template);

    const get = async (model: string) => await tmem.get<string>(model);

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
        if (model.includes("phi3")) {
            return "phi3"
        }
        if (model.includes("llama3")) {
            return "llama3"
        }
        if (model.includes("command-r")) {
            return "command-r"
        }
        if (model.includes("tinyllama")) {
            return "zephyr"
        }
        return "none"
    };

    const findTemplate = async (modelName: string): Promise<string> => {
        let templ = "none";
        try {
            templ = await get(modelName);
        } catch (e) { }
        if (templ == "none") {
            templ = guess(modelName);
        } else {
            console.log("Found template", templ, "for", modelName)
        }
        return templ
    };

    const persistTemplate = async (modelName: string, templ: string) => {
        if (templ.length > 0 && templ !== "none") {
            // persist state
            await set(templ, modelName)
        }
    };

    return {
        get,
        set,
        list,
        guess,
        findTemplate,
        persistTemplate,
    }
}

export { useTemplateForModel }