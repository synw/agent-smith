import { useAgentBrain } from "@agent-smith/brain";
//import { useAgentBrain, useLmExpert } from "../../brain/src/main.js";
import { LmTaskBuilder } from "@agent-smith/lmtask";
//import { LmTaskBuilder } from "../../lmtask/src/task.js";
import { MarkedExtension, marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import { FeatureType, RunMode } from "./interfaces.js";

marked.use(markedTerminal() as MarkedExtension);

let brain = useAgentBrain();
const modelsForExpert: Record<string, string> = {};

const taskBuilder = new LmTaskBuilder<FeatureType>(brain);

async function initExperts() {
    brain.experts.forEach((ex) => {
        ex.backend.setOnStartEmit(() => console.log(""))
        ex.backend.setOnToken((t) => {
            process.stdout.write(t)
        });
    });
}

async function initAgent(mode: RunMode, isVerbose = false): Promise<boolean> {
    if (!brain.state.get().isOn) {
        brain.resetExperts();
        await brain.initLocal();
        /*brain.backends.forEach((b) => {
            brain.addExpert(useLmExpert({
                name: b.name,
                backend: b,
                model: { name: "", ctx: 2048 },
                template: "none",
            }))
        });*/
        await initExperts();
        /*console.log("Backends:", brain.backends.map(x => x.name));
        console.log("Experts:", brain.experts.map(x => x.name));
        console.log("Bfm:", brain.backendsForModels);*/
    }
    const brainUp = brain.state.get().isOn;
    if (isVerbose) {
        if (!brainUp) {
            console.log("❌ No experts found for inference");
        }
        else {
            brain.experts.forEach((ex) => {
                console.log(`✅ Expert ${ex.name} is up`)
            })
        }
    }
    return brainUp
}

export { brain, initAgent, marked, modelsForExpert, taskBuilder };
