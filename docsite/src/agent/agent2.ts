import { useAgentSmith } from "@agent-smith/body";
import { useLmExpert, useAgentBrain } from "@agent-smith/brain";
import { Lm } from "@locallm/api";
/*import { useAgentSmith } from "@/packages/body/core";
import { useLmExpert } from "@/packages/brain/lm";
import { useAgentBrain } from "@/packages/brain/brain";*/

const kid = useLmExpert({
    name: "kid",
    localLm: "koboldcpp",
    templateName: "zephyr",
});

const lm = new Lm({
    providerType: "koboldcpp",
    serverUrl: "http://localhost:5002",
    onToken: (t) => { },
});
const corrector = useLmExpert({
    name: "corrector",
    backend: lm,
    templateName: "phi",
});

const brainModule = useAgentBrain([kid, corrector]);

const bob = useAgentSmith({
    name: "Bob",
    modules: [brainModule],
});

export { bob }