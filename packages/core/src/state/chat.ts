import { InferenceParams } from "@agent-smith/types";


let chatInferenceParams: InferenceParams = { temperature: 0.2, min_p: 0.05, max_tokens: 2048 };

function setChatInferenceParams(ip: InferenceParams) {
    chatInferenceParams = ip
}

export {
    chatInferenceParams,
    setChatInferenceParams,
}