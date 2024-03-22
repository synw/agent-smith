import { useAgentSmith } from "@agent-smith/body";
import { useLmExpert, useAgentBrain, LmBackendSpec } from "@agent-smith/brain";

const kid = useLmExpert({
    name: "kid",
    localLm: "koboldcpp",
    templateName: "zephyr",
});

const lm: LmBackendSpec = {
    name: "Corrector",
    providerType: "koboldcpp",
    serverUrl: "http://localhost:5002",
    enabled: false,
    apiKey: "",
};
const corrector = useLmExpert({
    name: "corrector",
    backend: lm,
    templateName: "phi",
});

const bob = useAgentSmith({
    name: "Bob",
    brain: useAgentBrain([kid, corrector]),
});

export { bob }