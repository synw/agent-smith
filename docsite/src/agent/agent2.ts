import { useAgentSmith } from "@agent-smith/body";
import { useLmExpert, useAgentBrain } from "@agent-smith/brain";
/*import { useAgentSmith } from "../../../packages/body/src/core";
import { useLmExpert } from "../../../packages/brain/src/lm";
import { useAgentBrain } from "../../../packages/brain/src/brain";*/
import { Lm } from "@locallm/api";

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

const bob = useAgentSmith({
    name: "Bob",
    brain: useAgentBrain([kid, corrector]),
});

export { bob }