import { InferenceParams } from "@locallm/types";
import { PromptTemplate } from "modprompt/dist/cls";
import { TaskConf } from "./interfaces";

function formatInferParams(ip: InferenceParams, conf: TaskConf, tpl?: PromptTemplate): InferenceParams {
    //console.log("TIP", ip);
    //console.log("TC", conf);
    if (!ip?.stop) {
        ip.stop = [];
    }
    if (tpl?.stop) {
        ip.stop.push(...tpl.stop);
    }
    const _ip = ip as Record<string, any>;
    // override infer params
    if (conf?.inferParams) {
        for (const [k, v] of Object.entries(conf.inferParams)) {
            _ip[k] = v
        }
    }
    if (conf?.model) {
        _ip.model = conf.model
    }
    return _ip as InferenceParams;
}

export {
    formatInferParams,
}