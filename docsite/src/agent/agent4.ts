import { useLmExpert } from "@agent-smith/brain";

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "alpaca",
});

export { expert }