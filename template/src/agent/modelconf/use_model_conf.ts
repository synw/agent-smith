import { ModelConf } from "@locallm/types";
import { LmTemplate } from "modprompt";
import { Ref, computed, reactive, ref } from "vue";
import { useTemplateForModel } from "@agent-smith/tfm";
import { AgentBrain } from "@agent-smith/brain";

const useModelConf = (brain: AgentBrain) => {
    const model = reactive<ModelConf>({ name: "", ctx: 2048 });
    const template = ref("none");
    const models = reactive<Record<string, Array<ModelConf>>>({});
    const _tfm = useTemplateForModel();

    const getTemplate = async () => {
        let templ = "none";
        try {
            templ = await _tfm.get(brain.ex.lm.model.name);
        } catch (e) { }
        if (templ == "none") {
            templ = _tfm.guess(brain.ex.lm.model.name);
            //console.log("TGUESS", templ);
            brain.ex.setTemplate(templ);
        } else {
            console.log("Found template", templ, "for", brain.ex.lm.model.name)
            brain.ex.setTemplate(templ);
        }
        //console.log("TEMPL:", templ)
        template.value = templ;
        return templ
    }

    const initLm = async (isTrying: Ref<boolean> | null = null): Promise<string> => {
        if (isTrying) {
            isTrying.value = true;
        }
        brain.resetExperts();
        await brain.discoverExperts();
        //console.log("Experts:", brain.experts);
        if (isTrying) {
            isTrying.value = false;
        }
        /*brain.ex.lm.onToken = (t) => {
            //console.log("T", t);
            stream.value = stream.value + t;
        };*/
        let t = "none";
        if (brain.state.get().isOn) {
            if (brain.ex.lm.providerType != "ollama") {
                await brain.ex.lm.modelsInfo();
                //console.log("M", brain.ex.lm.model)
                model.name = brain.ex.lm.model.name;
                model.ctx = brain.ex.lm.model.ctx;
                t = await getTemplate();
            } else {
                _sortModels();
                //console.log("MODELS", models)
            }
        }
        template.value = t;
        return t
    }

    const pickOtherModel = () => {
        model.name = "";
        model.ctx = 2048;
        template.value = "none";
    }

    const chooseModel = async (mod: string, ctx: number) => {
        await brain.ex.lm.loadModel(mod, ctx);
        model.name = brain.ex.lm.model.name;
        model.ctx = brain.ex.lm.model.ctx;
    }

    const persistTemplate = async (templ: string) => {
        if (templ.length > 0 && templ !== "none") {
            // persist state
            await _tfm.set(templ, brain.ex.lm.model.name)
        }
    }

    const chooseTemplate = async (tpl: LmTemplate) => {
        await persistTemplate(tpl.id);
        brain.ex.setTemplate(tpl.id);
        template.value = tpl.id;
    }

    function _sortModels() {
        const m = brain.ex.lm.models;
        console.log(m);
        const uniqueSizes = [...new Set(m.map(obj => obj.info?.size))];
        uniqueSizes.forEach((s) => {
            if (s) {
                models[s] = []
            }
        });
        brain.ex.lm.models.forEach((m) => {
            if (m.info) {
                models[m.info.size].push(m)
            }
        })
    }

    const hasModel = computed<boolean>(() => model.name.length > 0);
    const hasTemplate = computed<boolean>(() => template.value != "none");

    return {
        model,
        models,
        template,
        hasModel,
        hasTemplate,
        get isOn() { return brain.state.get().isOn },
        initLm,
        getTemplate,
        pickOtherModel,
        chooseModel,
        chooseTemplate,
    }
};

export { useModelConf }