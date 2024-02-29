import { useAgentSmith } from "@agent-smith/body";
import { useLmExpert, useAgentBrain } from "@agent-smith/brain";
/*import { useAgentSmith } from "@/packages/body/core";
import { useLmExpert } from "@/packages/brain/lm";
import { useAgentBrain } from "@/packages/brain/brain";*/
import { useStore } from '@nanostores/vue';

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "mistral",
});
const brainModule = useAgentBrain([expert]);
const joe = useAgentSmith({
    name: "Joe",
    modules: [brainModule],
});
const joeState = useStore(joe.state);
const brain = brainModule.brain;
// this part is to get reactive variables in the ui template
const brainState = useStore(brain.state);
const brainStream = useStore(brain.stream);

export { joe, joeState, brain, brainState, brainStream }