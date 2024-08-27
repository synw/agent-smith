import { useAgentBrain } from "@agent-smith/brain";
import { useLmTask } from "@agent-smith/lmtask";
//import { useLmTask } from "../../lmtask/src/lmtask.js";
import logUpdate from 'log-update';
import { MarkedExtension, marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import { RunMode } from "./interfaces.js";
import { formatMode } from "./state/state.js";

marked.use(markedTerminal() as MarkedExtension);

let brain = useAgentBrain();
const modelsForExpert: Record<string, string> = {};

const taskReader = useLmTask(brain);

async function initExperts() {
    brain.experts.forEach((ex) => {
        ex.setOnStartEmit(() => console.log(""))
        ex.setOnToken((t) => {
            if (formatMode.value == "markdown") {
                logUpdate((marked.parse(ex.stream.get() + t) as string).trim())
            } else {
                logUpdate((ex.stream.get() + t).trim())
            }
        });
    });
}

function clearOutput() {
    logUpdate.clear();
}

async function initAgent(mode: RunMode, isVerbose = false): Promise<boolean> {
    if (!brain.state.get().isOn) {
        brain.resetExperts();
        await brain.discoverLocal();
        await initExperts();
        await brain.expertsForModelsInfo();
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

export { brain, initAgent, clearOutput, marked, modelsForExpert, taskReader };
