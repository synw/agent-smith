import { InferenceParams, ModelConf } from "@locallm/types"
import { Ref, reactive, ref } from "vue";
//import { useTemplateForModel } from "@agent-smith/tfm";
import { brain } from "./agent";

const defaultInferenceParams: InferenceParams = {
    stream: true,
    temperature: 0.2,
    top_k: 0,
    top_p: 1,
    min_p: 0.05,
};

const inferenceParams = reactive(defaultInferenceParams);
const model = reactive<ModelConf>({ name: "", ctx: 2048 });
const template = ref("none");

//const tfm = useTemplateForModel();

async function initLm(isTrying: Ref<boolean> | null = null) {
    if (isTrying) {
        isTrying.value = true;
    }
    brain.resetExperts();
    await brain.discoverLocal();
    console.log("Experts:", brain.backends);
    if (isTrying) {
        isTrying.value = false;
    }
    /*if (brain.state.get().isOn) {
        let templ = "none";
        try {
            templ = await tfm.get(brain.ex.lm.model.name);
        } catch (e) { }
        if (templ == "none") {
            template.value = tfm.guess(brain.ex.lm.model.name);
            brain.ex.setTemplate(template.value);
        } else {
            console.log("Found template", templ, "for", brain.ex.lm.model.name)
            template.value = templ;
            brain.ex.setTemplate(template.value);
        }
        if (brain.ex.lm.providerType != "ollama") {
            model.name = brain.ex.lm.model.name;
            model.ctx = brain.ex.lm.model.ctx;
        }
    }*/
}

export { inferenceParams, template, model, initLm }