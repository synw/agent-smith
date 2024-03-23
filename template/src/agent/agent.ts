import { useAgentSmith } from "@agent-smith/body";
import { useAgentBrain } from "@agent-smith/brain";
//import { useAgentBrain } from "../../../packages/brain/src/brain";
import { useStore } from '@nanostores/vue';

let brain = useAgentBrain();

const agent = useAgentSmith({
    name: "Agent",
    brain: brain,
});

const state = useStore(agent.state);

export { agent, state, brain }