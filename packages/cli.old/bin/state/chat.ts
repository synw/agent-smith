import { InferenceParams } from "@locallm/types";
import { PromptTemplate } from "modprompt";


let chatInferenceParams: InferenceParams = { temperature: 0.2, min_p: 0.05, max_tokens: 2048 };
let chatTemplate: PromptTemplate = new PromptTemplate("none");

function setChatTemplate(tpl: PromptTemplate) {
    chatTemplate = tpl
}

function setChatInferenceParams(ip: InferenceParams) {
    chatInferenceParams = ip
}

export {
    chatInferenceParams,
    chatTemplate,
    setChatInferenceParams,
    setChatTemplate,
}