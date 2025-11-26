import { Lm } from "@locallm/api";
import { reactive, ref } from "@vue/reactivity";
import colors from "ansi-colors";
import { readBackends } from "../db/read.js";
import { setDefaultBackend } from "../db/write.js";
import { runtimeDataError } from "../utils/user_msgs.js";

const backend = ref<Lm>();
const backends = reactive<Record<string, Lm>>({});
const isBackendUp = ref(false);

async function initBackends(isVerbose = false) {
    const rmb = readBackends();
    //console.log("Backends:", rmb)
    let defaultBackendName: string | null = null;
    for (const bk of Object.values(rmb)) {
        //console.log("BK", bk.name);
        const lm = new Lm({
            providerType: bk.type,
            serverUrl: bk.url,
        });
        lm.name = bk.name;
        if (bk?.apiKey) {
            lm.apiKey = bk.apiKey
        };
        backends[bk.name] = lm;
        if (bk.isDefault) {
            defaultBackendName = bk.name
        }
    }
    if (defaultBackendName !== null) {
        backend.value = backends[defaultBackendName];
        //console.log("Setting default backend", defaultBackendName, "/", backend.value.name)
        isBackendUp.value = await probeBackend(backend.value, isVerbose);

        if (isBackendUp.value && backend.value.providerType == "ollama") {
            await backend.value.modelsInfo();
        }
    }
}

async function setBackend(name: string, isVerbose = false) {
    if (!(Object.keys(backends).includes(name))) {
        runtimeDataError(`Backend ${name} not found. Available backends: ${Object.keys(backends)}`);
        return
    }
    backend.value = backends[name];
    setDefaultBackend(name);
    console.log("Default backend set to", name);
    isBackendUp.value = await probeBackend(backend.value, isVerbose);
}

async function listBackends() {
    //console.log("DEFB", backend.value?.name);
    for (const [name, lm] of Object.entries(backends)) {
        const bcn = name == backend.value?.name ? colors.bold(name) : name;
        //const isUp = await probeBackend(lm, false);
        const buf = new Array<string>("-", bcn, colors.dim("(" + lm.providerType + ") " + lm.serverUrl), /*isUp ? "🟢" : ""*/);
        console.log(buf.join(" "))
    }
}

const probeBackend = async (lm: Lm, isVerbose: boolean): Promise<boolean> => {
    let isUp = false;
    switch (lm.providerType) {
        case "llamacpp":
            try {
                if (isVerbose) {
                    const info = await lm.modelInfo();
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
                if (lm.model.name.length > 0) {
                    if (isVerbose) {
                        const info = await lm.modelInfo();
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
        case "openai":
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
    return isUp
}

export {
    backend, backends, initBackends, listBackends, setBackend
};
