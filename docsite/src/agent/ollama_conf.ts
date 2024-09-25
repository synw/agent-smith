import { ModelConf } from "@locallm/types";
import { reactive } from "@vue/reactivity";
import { useTmem } from "@agent-smith/tmem";
import { LmBackend } from "@agent-smith/brain";
import { useTemplateForModel } from "@agent-smith/tfm";

const tfm = useTemplateForModel();

const useOllamaConf = (backend: LmBackend) => {
    const models = reactive<Record<string, Array<ModelConf>>>({});
    const tmem = useTmem<Array<ModelConf>>("templates", []);

    const init = async (): Promise<void> => {
        if (backend.state.get().isUp) {
            switch (backend.lm.providerType) {
                case "ollama":
                    await backend.lm.modelsInfo();
                    _sortModels();
                    break;
                case "browser":
                    await backend.lm.modelsInfo();
                    break
                default:
                    await backend.lm.info()
                    break;
            }
        }
    }

    const getTemplate = async (modelName: string): Promise<string | undefined> => {
        let templ: string | undefined;
        try {
            templ = await tmem.get(modelName);
        } catch (e) { console.warn("ERR", e) }
        if (!templ) {
            templ = tfm.guess(modelName);
        }
        if (templ && (templ != "none")) {
            console.log("Found template", templ, "for", modelName);
        }
        return templ
    }

    const persistTemplate = async (templ: string, modelName: string) => {
        if (templ.length > 0 && templ !== "none") {
            await tmem.set(templ, modelName)
        }
    }

    function _sortModels(skipEmbed = true) {
        //const models = backend.lm.models;
        //console.log(m);
        const safeList = new Set<ModelConf>();
        for (const m of backend.lm.models) {
            if (skipEmbed) {
                if (!m.name.includes("embed-")) {
                    safeList.add(m)
                }
            } else {
                safeList.add(m)
            }
        }
        //console.log("Safe list", safeList);
        const sl = Array.from(safeList);
        const uniqueSizes = new Array<string>(...sl.map(obj => obj.info?.size ?? ""));
        let numUniqueSizes = new Array<{ size: number, str: string, norm: string }>();
        uniqueSizes.forEach((s) => {
            let n: number;
            let norm = "";
            if (s.includes("M")) {
                const _ns = "0." + s.replace("M", "");
                n = parseFloat(_ns);
                norm = s;
            }
            else {
                const _ns = s.replace("B", "");
                n = parseInt(_ns);
                norm = `${n}B`;
            }
            numUniqueSizes.push({
                size: n,
                str: s,
                norm: norm,
            });
        });
        numUniqueSizes = numUniqueSizes.sort((a, b) => a.size - b.size);
        numUniqueSizes.forEach((s) => {
            if (s) {
                models[s.norm] = []
            }
        });
        for (const m of backend.lm.models) {
            if (m.info) {
                // @ts-ignore
                const model = numUniqueSizes.find(item => item.str === m.info.size);
                if (model) {
                    models[model.norm].push(m)
                }
            }
        }
    }

    return {
        models,
        init,
        getTemplate,
        persistTemplate,
    }
}

export { useOllamaConf }