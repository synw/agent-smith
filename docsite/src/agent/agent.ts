import { useAgentSmith } from "@agent-smith/body";
import { useLmExpert, useAgentBrain } from "@agent-smith/brain";
/*import { useAgentSmith } from "../../../packages/body/src/core";
import { useLmExpert } from "../../../packages/brain/src/lm";
import { useAgentBrain } from "../../../packages/brain/src/brain";*/
import { useStore } from '@nanostores/vue';

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "zephyr",
});
const brain = useAgentBrain([expert]);
const joe = useAgentSmith({
    name: "Joe",
    brain: brain,
});
const joeState = useStore(joe.state);
// this part is to get reactive variables in the ui template
const brainState = useStore(brain.state);
const brainStream = useStore(brain.stream);

export { joe, joeState, brain, brainState, brainStream }