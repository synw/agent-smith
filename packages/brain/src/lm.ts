import { map, atom } from 'nanostores';
import { PromptTemplate } from "modprompt";
import { compile, serializeGrammar } from "@intrinsicai/gbnfgen";
import { Lm } from "@locallm/api";
import { InferenceParams, InferenceResult } from "@locallm/types";
import { defaultLocalBackends } from "./const.js";
import { LmExpertSpec, LmThinkingOptionsSpec } from "@/interfaces.js";

const useLmExpert = (spec: LmExpertSpec) => {
    let _lm: Lm;
    let onToken = spec?.onToken;
    if (spec.localLm) {
        switch (spec.localLm) {
            case "koboldcpp":
                _lm = new Lm({
                    providerType: defaultLocalBackends[1].providerType,
                    serverUrl: defaultLocalBackends[1].serverUrl,
                    apiKey: defaultLocalBackends[1].apiKey,
                    onToken: (t: string) => { stream.set(stream.get() + t) },
                });
                break;
            case "llamacpp":
                _lm = new Lm({
                    providerType: defaultLocalBackends[0].providerType,
                    serverUrl: defaultLocalBackends[0].serverUrl,
                    apiKey: defaultLocalBackends[0].apiKey,
                    onToken: (t: string) => { stream.set(stream.get() + t) },
                });
        }
    } else if (spec.backend) {
        if (!["llama.cpp", "koboldcpp"].includes(spec.backend.providerType)) {
            throw new Error(`Provider ${spec.backend.providerType} is not supported`)
        }
        _lm = new Lm({
            providerType: spec.backend.providerType,
            serverUrl: spec.backend.serverUrl,
            apiKey: spec.backend.apiKey,
            onToken: (t: string) => { stream.set(stream.get() + t) },
        });
    } else {
        throw new Error("Provide a backend or a localLm parameter to initialize the expert");
    }
    let template: PromptTemplate;
    if (spec.template) {
        template = spec.template;
    } else if (spec.templateName) {
        template = new PromptTemplate(spec.templateName);
    } else {
        throw new Error("Provide either a templateName or a template parameter for the expert")
    }
    const name = spec.name ?? _lm.name;
    const description = spec.description ?? "";
    const stream = atom("");
    // state
    const state = map({
        isUp: false,
        isStreaming: false,
        isThinking: false,
    });

    const think = async (
        prompt: string, inferenceParams: InferenceParams = {}, options: LmThinkingOptionsSpec = {},
    ): Promise<InferenceResult> => {
        if (!state.get().isUp) {
            throw new Error(`Expert ${name} can not think because it is down: check the server or probe it again`);
        }
        stream.set("");
        const paramDefaults = {
            stream: true
        };
        const completionParams: InferenceParams = { ...paramDefaults, ...inferenceParams };
        if (completionParams.stop) {
            if (completionParams.stop.length == 0) {
                delete completionParams.stop;
            }
        }
        console.log("Params", inferenceParams);
        console.log("Options", options);
        if (options?.tsGrammar) {
            completionParams.grammar = serializeGrammar(await compile(options.tsGrammar, "Grammar"));
        }
        if (options?.grammar) {
            completionParams.grammar = options.grammar;
        }
        _lm.onToken = (token: string) => {
            //sconsole.log(`>>>${token}<<<`);
            stream.set(stream.get() + token);
            if (onToken) {
                onToken(token);
            }
            if (options?.onToken) {
                options.onToken(token);
            }
            //++inferResults.totalTokens
        }
        _lm.onStartEmit = (s) => {
            state.setKey("isStreaming", true);
            //console.log("Start emit", s);
        };
        _lm.onError = (msg: string) => {
            state.setKey("isStreaming", false);
            state.setKey("isThinking", false);
            throw new Error(msg)
        };
        if (options?.verbose) {
            console.log("Inference params", JSON.stringify(completionParams, null, "  "));
        }
        const p = template.prompt(prompt);
        state.setKey("isThinking", true);
        let _parseJson = (options?.tsGrammar !== undefined) || (options?.grammar !== undefined);
        if (options?.parseJson) {
            _parseJson = options.parseJson
        }
        let parseJsonFunc = (t: string) => JSON.parse(t);
        // dirty patch
        if (template.name == "chatml") {
            parseJsonFunc = (t: string) => JSON.parse(t.replace("<|im_end|>", ""));
        }
        const respData = await _lm.infer(p, completionParams, _parseJson, parseJsonFunc);
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
        await _lm.abort()
    }

    const probe = async (isVerbose = false): Promise<boolean> => {
        let isUp = false;
        switch (_lm.providerType) {
            case "llamacpp":
                try {
                    const info = await _lm.info();
                    if (isVerbose) {
                        console.log(`Provider ${_lm.name} up`, info);
                    }
                    isUp = true;
                } catch (e) {
                    if (isVerbose) {
                        console.log(`Provider ${_lm.name} down`, e)
                    }
                }
                break;
            case "koboldcpp":
                try {
                    const info = await _lm.info();
                    if (_lm.model.name.length > 0) {
                        if (isVerbose) {
                            console.log(`Provider ${_lm.name} up`, info)
                        }
                        isUp = true;
                    } else {
                        if (isVerbose) {
                            console.log(`Provider ${_lm.name} down`)
                        }
                    }
                } catch (e) {
                    if (isVerbose) {
                        console.log(`Provider ${_lm.name} down`, e)
                    }
                }
                break;
            case "ollama":
                console.warn("The Ollama provider is not yet supported");
                break;
                try {
                    await _lm.modelsInfo();
                    if (isVerbose) {
                        console.log(`Provider ${_lm.name} up`)
                    }
                    isUp = true;
                } catch (e) {
                    if (isVerbose) {
                        console.log(`Provider ${_lm.name} down`, e)
                    }
                }
                break;
            default:
                throw new Error("Unknown provider type")
        }
        state.setKey("isUp", isUp);
        return isUp
    }

    return {
        stream: stream,
        name: name,
        description: description,
        lm: _lm,
        template,
        state,
        probe,
        think,
        abortThinking,
    }
}

export { useLmExpert }