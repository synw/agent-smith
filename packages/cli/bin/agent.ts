import { useAgentBrain } from "@agent-smith/brain";
import { useLmTask } from "@agent-smith/lmtask";
import logUpdate from 'log-update';
import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import { RunMode } from "./interfaces.js";
import { formatMode } from "./state/state.js";

marked.use(markedTerminal());

let brain = useAgentBrain();
const modelsForExpert: Record<string, string> = {};

const taskReader = useLmTask(brain);

async function initExperts() {
    brain.experts.forEach((ex) => {
        ex.setOnStartEmit(() => console.log("Start emitting"))
        ex.setOnToken((t) => {
            if (formatMode.value == "markdown") {
                logUpdate((marked.parse(ex.stream.get() + t) as string).trim())
            } else {
                logUpdate((ex.stream.get() + t).trim())
            }
        });
    });
}

async function initAgent(mode: RunMode) {
    if (!brain.state.get().isOn) {
        brain.resetExperts();
        await brain.discoverLocal();
        await initExperts();
        await brain.expertsForModelsInfo();
        //console.log("Models:", brain.expertsForModels);
    }
    //console.log("Experts:", brain.experts);
    if (!brain.state.get().isOn) {
        console.log("❌ No experts found for inference");
        /*if (mode == "cmd") {
            exit(0)
        }*/
    }
    if (mode == "cli") {
        brain.experts.forEach((ex) => {
            console.log(`✅ Expert ${ex.name} is up`)
        })
    }
}

export { brain, initAgent, modelsForExpert, taskReader };
