import { useAgentSmith } from "@agent-smith/body";
import { useLmExpert, useAgentBrain } from "@agent-smith/brain";
/*import { useAgentSmith } from "@/packages/body/core";
import { useLmExpert } from "@/packages/brain/lm";
import { useAgentBrain } from "@/packages/brain/brain";*/

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "chatml",
});
const brainModule = useAgentBrain([expert]);
const joe = useAgentSmith({
    name: "Joe",
    modules: [brainModule],
});

export { joe }