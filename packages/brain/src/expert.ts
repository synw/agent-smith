import { map } from 'nanostores';
import { PromptTemplate } from "modprompt";
import { compile, serializeGrammar } from "@intrinsicai/gbnfgen";
import { InferenceParams, InferenceResult, ModelConf, OnLoadProgress } from "@locallm/types";
import { ExpertState, ExpertStatus, LmExpert, LmExpertSpec, LmThinkingOptionsSpec } from "./interfaces.js";

const useLmExpert = (spec: LmExpertSpec): LmExpert => {
    const backend = spec.backend;
    let model = spec.model;
    const description = spec.description ?? "";
    // state
    const state = map<ExpertState>({
        status: "unavailable",
        isStreaming: false,
        isThinking: false,
    });
    const name = spec.name;
    let template: PromptTemplate = new PromptTemplate("none");
    if (spec.template) {
        if (typeof spec.template == "string") {
            template = new PromptTemplate(spec.template)
        } else {
            template = spec.template;
        }
    }

    const checkStatus = (): ExpertStatus => {
        let isBackendUp = false;
        let isModelLoaded = false;
        if (backend.state.get().isUp) {
            isBackendUp = true
        }
        if (backend.lm.model.name == model.name) {
            isModelLoaded = true
        }
        if (["koboldcpp", "llamacpp"].includes(backend.lm.providerType)) {
            if (isBackendUp) {
                if (isModelLoaded) {
                    state.setKey("status", "ready");
                }
            }
        } else {
            if (isBackendUp) {
                if (!isModelLoaded) {
                    state.setKey("status", "available");
                } else {
                    state.setKey("status", "ready");
                }
            }
        }
        return state.get().status
    }

    const think = async (
        prompt: string, inferenceParams: InferenceParams = {}, options: LmThinkingOptionsSpec = {},
    ): Promise<InferenceResult> => {
        if (!backend.state.get().isUp) {
            throw new Error(`Expert ${name} can not think because it is down: check the backend or probe it again`);
        }
        // auto load model if available
        if (backend.lm.model.name != model.name) {
            if (backend.lm.providerType == "koboldcpp" || backend.lm.providerType == "llamacpp") {
                throw new Error(`The model ${model.name} is not loaded in the ${backend.lm.name} backend`)
            } else {
                console.log("Loading model", model.name, "in backend", backend.lm.name);
                if (backend.lm.providerType == "ollama") {
                    await backend.lm.loadModel(model.name, model.ctx);
                } else {
                    if (!model?.extra?.urls) {
                        throw new Error("Provide urls in ModelConf for a browser backend");
                    }
                    await backend.lm.loadModel(model.name, model.ctx, model.extra.urls);
                }
            }
        }
        // set infer params
        backend.resetStream();
        const paramDefaults = {
            stream: true
        };
        const completionParams: InferenceParams = { ...paramDefaults, ...inferenceParams };
        if (completionParams.stop) {
            if (completionParams.stop.length == 0) {
                delete completionParams.stop;
            }
        }
        if (options?.tsGrammar) {
            completionParams.grammar = serializeGrammar(await compile(options.tsGrammar, "Grammar"));
        }
        if (options?.grammar) {
            completionParams.grammar = options.grammar;
        }
        if (options?.verbose) {
            console.log("Params", completionParams);
            console.log("Options", options);
            //console.log("Inference params", JSON.stringify(completionParams, null, "  "));
        }
        let p = "";
        if (options.skipTemplate === true) {
            p = prompt
        } else {
            p = template.prompt(prompt)
        }
        state.setKey("isThinking", true);
        let _parseJson = (options?.tsGrammar !== undefined) || (options?.grammar !== undefined);
        if (options?.parseJson) {
            _parseJson = options.parseJson
        }
        // remove the EOS token for json parsing
        let parseJsonFunc = (t: string) => JSON.parse(t);
        if (_parseJson) {
            if (backend.lm.providerType == "koboldcpp") {
                parseJsonFunc = (t: string) => {
                    //console.log("Start T", t);
                    let s = t.replace(/\\_/g, '_');
                    if (template.stop) {
                        s = s.replace(template.stop[0], "");
                    }
                    //console.log("End T", s, [t].includes('\\_'));
                    return JSON.parse(s)
                };
            } else {
                parseJsonFunc = (t: string) => {
                    let s = t;
                    if (template.stop) {
                        s = t.replace(template.stop[0], "");
                    }
                    return JSON.parse(s)
                }
            }
        }
        const respData = await backend.lm.infer(p, completionParams, _parseJson, parseJsonFunc);
        state.setKey("isStreaming", false);
        state.setKey("isThinking", false);
        return respData
    }

    const abortThinking = async () => {
        console.log("Abort thinking");
        if (!state.get().isThinking) {
            console.warn(`The expert ${name} is not thinking, nothing to abort`);
            return
        }
        await backend.lm.abort()
    }

    const setTemplate = (tpl: string | PromptTemplate) => {
        //console.log("SET TEMPLATE", tpl);
        switch (typeof tpl) {
            case "string":
                template = new PromptTemplate(tpl)
                break;
            default:
                template = tpl
                break;
        }
    }

    const setModel = (m: ModelConf) => {
        model = m
    }

    const loadModel = async (onLoadProgress?: OnLoadProgress): Promise<void> => {
        if (!backend.state.get().isUp) {
            throw new Error("Can not load model: the backend is down")
        }
        if (["koboldcpp", "llamacpp"].includes(backend.lm.providerType)) {
            console.warn("Can not load model with this backend")
        } else {
            //console.log("Loading model", model, `for expert ${name}`);
            await backend.lm.loadModel(model.name, model.ctx, model?.extra?.urls, onLoadProgress)
        }
        state.setKey("status", "ready");
    }

    return {
        get stream() { return backend.stream },
        get backend() { return backend },
        get model() { return model },
        name,
        description,
        get template() { return template },
        state,
        lm: backend.lm,
        think,
        abortThinking,
        setTemplate,
        setModel,
        checkStatus,
        loadModel,
    }
}

export { useLmExpert }