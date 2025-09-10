//import { useLmBackend } from "@agent-smith/brain";
import { readBackends } from "../db/read.js";
import { LmProviderType } from "@locallm/types";
import { LmBackend, LmBackendSpec, useLmBackend } from "@agent-smith/brain";

function initRemoteBackends(): Array<LmBackend> {
    const rmb = readBackends();
    const rmbs = new Array<LmBackend>();
    rmb.forEach(b => {
        const bcs: LmBackendSpec = {
            name: b.name,
            providerType: b.type as LmProviderType,
            serverUrl: b.uri,
        };
        if (b?.apiKey) {
            bcs.apiKey = b.apiKey
        };
        rmbs.push(useLmBackend(bcs));
    });
    return rmbs
}

export {
    initRemoteBackends,
}