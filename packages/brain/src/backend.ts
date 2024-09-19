import { map, atom } from 'nanostores';
import { Lm } from "@locallm/api";
import { defaultLocalBackends } from "./const.js";
import { LmBackend, LmBackendSpec } from "./interfaces.js";
import { WllamaProvider } from '@locallm/browser';

const useLmBackend = (spec: LmBackendSpec): LmBackend => {
    let lm: Lm | WllamaProvider;
    let onToken = spec?.onToken;
    let onStartEmit = spec?.onStartEmit;
    const description = spec.description ?? "";
    const stream = atom("");
    // state
    const state = map({
        isUp: false,
    });
    if (spec.localLm) {
        switch (spec.localLm) {
            case "koboldcpp":
                lm = new Lm({
                    providerType: defaultLocalBackends[1].providerType!,
                    serverUrl: defaultLocalBackends[1].serverUrl!,
                    apiKey: defaultLocalBackends[1].apiKey,
                    onToken: (t: string) => {
                        stream.set(stream.get() + t);
                        if (onToken) {
                            onToken(t)
                        }
                    },
                    onStartEmit: onStartEmit,
                });
                break;
            case "llamacpp":
                lm = new Lm({
                    providerType: defaultLocalBackends[0].providerType!,
                    serverUrl: defaultLocalBackends[0].serverUrl!,
                    apiKey: defaultLocalBackends[0].apiKey,
                    onToken: (t: string) => {
                        stream.set(stream.get() + t);
                        if (onToken) {
                            onToken(t)
                        }
                    },
                    onStartEmit: onStartEmit,
                });
                break;
            case "ollama":
                lm = new Lm({
                    providerType: defaultLocalBackends[2].providerType!,
                    serverUrl: defaultLocalBackends[2].serverUrl!,
                    apiKey: defaultLocalBackends[2].apiKey,
                    onToken: (t: string) => {
                        stream.set(stream.get() + t);
                        if (onToken) {
                            onToken(t)
                        }
                    },
                    onStartEmit: onStartEmit,
                });
                break;
            case "browser":
                lm = WllamaProvider.init({
                    name: "browser",
                    onToken: (t: string) => {
                        stream.set(t);
                        if (onToken) {
                            onToken(t)
                        }
                    },
                    onStartEmit: onStartEmit,
                });
                break;
            default:
                throw new Error(`Unknown provider type ${spec.localLm}`)
        }
    } else if (spec.serverUrl && spec.providerType) {
        if (!["llama.cpp", "koboldcpp", "ollama"].includes(spec.providerType)) {
            throw new Error(`Provider ${spec.providerType} is not supported`)
        }
        if (!spec.serverUrl) {
            throw new Error("Provide a serverUrl param")
        }
        lm = new Lm({
            providerType: spec.providerType,
            serverUrl: spec.serverUrl,
            apiKey: spec.apiKey,
            onToken: (t: string) => { stream.set(stream.get() + t) },
            onStartEmit: onStartEmit,
        });
    } else {
        throw new Error("Provide either a serverUrl and providerType or a localLm parameter to initialize the expert");
    }
    if (lm.providerType == "browser") {
        state.setKey("isUp", true);
    }
    const name = spec.name ?? lm.name;

    const probe = async (isVerbose = false): Promise<boolean> => {
        let isUp = false;
        switch (lm.providerType) {
            case "llamacpp":
                try {
                    const info = await lm.info();
                    if (isVerbose) {
                        console.log(`Provider ${lm.name} up`, info);
                    }
                    isUp = true;
                } catch (e) {
                    if (isVerbose) {
                        console.log(`Provider ${lm.name} down`, e)
                    }
                }
                break;
            case "koboldcpp":
                try {
                    const info = await lm.info();
                    if (lm.model.name.length > 0) {
                        if (isVerbose) {
                            console.log(`Provider ${lm.name} up`, info)
                        }
                        isUp = true;
                    } else {
                        if (isVerbose) {
                            console.log(`Provider ${lm.name} down`)
                        }
                    }
                } catch (e) {
                    if (isVerbose) {
                        console.log(`Provider ${lm.name} down`, e)
                    }
                }
                break;
            case "ollama":
                //console.warn("The Ollama provider is not yet supported");
                //break;
                try {
                    await lm.modelsInfo();
                    if (isVerbose) {
                        console.log(`Provider ${lm.name} up`)
                    }
                    isUp = true;
                } catch (e) {
                    if (isVerbose) {
                        console.log(`Provider ${lm.name} down`, e)
                    }
                }
                break;
            case "browser":
                await lm.modelsInfo();
                isUp = true
                break;
            default:
                throw new Error("Unknown provider type")
        }
        state.setKey("isUp", isUp);
        return isUp
    }

    const setOnToken = (func: (t: string) => void) => {
        onToken = func
    }

    const setOnStartEmit = (func: () => void) => {
        onStartEmit = func
    }

    const resetStream = () => stream.set("");

    return {
        stream,
        name,
        description,
        lm,
        state,
        probe,
        setOnToken,
        setOnStartEmit,
        resetStream,
    }
}

export { useLmBackend }