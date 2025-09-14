import { Lm } from "@locallm/api";
import { reactive, ref } from "@vue/reactivity";
import { readBackends } from "../db/read.js";

const backend = ref<Lm>();
const backends = reactive<Record<string, Lm>>({});

function initBackends() {
    const rmb = readBackends();
    let defaultBackendName: string | null = null;
    for (const bk of Object.values(rmb)) {
        const lm = new Lm({
            providerType: bk.type,
            serverUrl: bk.url,
        });
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
    }
}

export {
    backends,
    backend,
    initBackends,
}