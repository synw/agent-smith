import { useAgentSmith } from "@agent-smith/body";
import { useLmExpert, useAgentBrain } from "@agent-smith/brain";
/*import { useAgentSmith } from "../../../packages/body/src/core";
import { useLmExpert } from "../../../packages/brain/src/lm";
import { useAgentBrain } from "../../../packages/brain/src/brain";*/

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "chatml",
});

const joe = useAgentSmith({
    name: "Joe",
    brain: useAgentBrain([expert]),
});

export { joe }