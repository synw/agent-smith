import { useAgentSmith } from "@agent-smith/body";
import { useAgentBrain } from "@agent-smith/brain";
import { useModelConf } from "./modelconf/use_model_conf";

let brain = useAgentBrain();

const agent = useAgentSmith({
    name: "Agent",
    brain: brain,
});

const conf = useModelConf(brain);

export { agent, brain, conf }