import { useAgentBrain } from "@agent-smith/brain";
//import { LmTaskBuilder } from "@agent-smith/lmtask";
import { LmTaskBuilder } from "../../lmtask/dist/task.js";
import { MarkedExtension, marked } from 'marked';
import { markedTerminal } from "marked-terminal";
import { FeatureType } from "./interfaces.js";

marked.use(markedTerminal() as MarkedExtension);

let brain = useAgentBrain();

const taskBuilder = new LmTaskBuilder<FeatureType>(brain);

async function initExperts() {
    brain.experts.forEach((ex) => {
        ex.backend.setOnToken((t) => {
            process.stdout.write(t)
        });
    });
}

async function initAgent(isVerbose = false): Promise<boolean> {
    if (!brain.state.get().isOn) {
        brain.resetExperts();
        //console.log("Init", isVerbose);
        await brain.initLocal(true, isVerbose);
        await initExperts();
        //console.log("Backends:", brain.backends.map(x => x.name));
        //console.log("Experts:", brain.experts.map(x => x.name));
        //console.log("Bfm:", brain.backendsForModels);
    }
    const brainUp = brain.state.get().isOn;
    if (isVerbose) {
        if (!brainUp) {
            console.log("❌ No backends found for inference");
        }
        else {
            brain.backends.forEach((b) => {
                console.log(`✅ Backend ${b.name} is up`);
                if (b.lm.providerType == "ollama") {
                    console.log("   Models:", b.lm.models.map(x => x.name))
                } else {
                    console.log("   Model:", b.lm.model.name)
                }
            })
        }
    }
    return brainUp
}

export { brain, initAgent, marked, taskBuilder };
