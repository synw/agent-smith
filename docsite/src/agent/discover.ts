//import { useLmExpert, LmExpert } from "@agent-smith/brain";
import { useLmExpert } from "../../../packages/brain/src/lm";
import { LmExpert } from "../../../packages/brain/src/interfaces";

async function discoverExperts(): Promise<Array<LmExpert>> {
    const ex = new Array<LmExpert>();
    const kobold = useLmExpert({
        name: "koboldcpp",
        localLm: "koboldcpp",
        templateName: "none",
    });
    const llamacpp = useLmExpert({
        name: "llamacpp",
        localLm: "llamacpp",
        templateName: "none",
    });
    const ollama = useLmExpert({
        name: "ollama",
        localLm: "ollama",
        templateName: "none",
    });
    const [isKobUp, isLamUp, isOlamUp] = await Promise.all([
        kobold.probe(true),
        llamacpp.probe(true),
        ollama.probe(true),
    ]);
    if (isKobUp) {
        ex.push(kobold)
    }
    if (isLamUp) {
        ex.push(llamacpp)
    }
    if (isOlamUp) {
        ex.push(ollama)
    }
    return ex
}

export { discoverExperts }