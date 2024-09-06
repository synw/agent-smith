import { useLmExpert, useAgentBrain } from "@agent-smith/brain";

const brain = useAgentBrain([
    useLmExpert({
        name: "browser",
        localLm: "browser",
    }),
]);

export { brain }