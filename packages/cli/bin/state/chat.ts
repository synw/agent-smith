import { InferenceParams } from "@locallm/types";
import { reactive } from "@vue/reactivity";


const chatInferenceParams = reactive<InferenceParams>({ temperature: 0.2, min_p: 0.05, max_tokens: 2048 });

export {
    chatInferenceParams,
}