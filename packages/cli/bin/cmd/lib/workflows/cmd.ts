import { isDebug, isVerbose } from "../../../state/state.js";
import { NodeReturnType } from "../../../interfaces.js";
import { readWorkflow } from "./read.js";
import { executeTaskCmd } from "../execute_task.js";
import { executeActionCmd } from "../execute_action.js";

async function executeWorkflowCmd(name: string, args: Array<any> = [], options: any = {}): Promise<NodeReturnType<any>> {
    const { workflow, found } = await readWorkflow(name);
    if (!found) {
        throw new Error(`Workflow ${name} not found`)
    }
    //console.log("WFCMD", workflow);
    const stepNames = Object.keys(workflow);
    if (isDebug.value || isVerbose.value) {
        console.log("Running workflow", name, stepNames.length, "steps");
    }
    let params: Record<string, any> = {};
    let i = 0;
    const finalTaskIndex = stepNames.length + 1;
    let taskRes: NodeReturnType<any> = { data: {}, error: new Error("Empty task res") };
    for (const [name, step] of Object.entries(workflow)) {
        if (isDebug.value || isVerbose.value) {
            console.log(`${i + 1}: ${step.type} ${name}`)
        }
        const p = i == 0 ? [name, ...args] : { name: name, ...params };
        switch (step.type) {
            case "task":
                try {
                    //console.log("EXECT", p);
                    taskRes = await executeTaskCmd(p, options);
                } catch (e) {
                    throw new Error(`Workflow task ${i + 1} error: ${e}`)
                }
                break;
            case "action":
                try {
                    const ares = await executeActionCmd(p, options, true);
                    taskRes = ares.data;
                    if (i == finalTaskIndex) {
                        //console.log("LAST ACT", i, finalTaskIndex, p);
                        console.log(taskRes.data);
                    }
                } catch (e) {
                    throw new Error(`Workflow action ${i + 1} error: ${e}`)
                }
                break;
            /*case "cmd":
                try {
                    taskRes = await executeCmd(args, options);
                } catch (e) {
                    throw new Error(`Wokflow ${i + 1} error: ${e}`)
                }
                break;*/
            default:
                throw new Error(`Unknown task type ${step.type} in workflow ${name}`)
        }
        params = taskRes;
        //console.log("WFR", taskRes)
        ++i
    }
    return taskRes
}

export {
    executeWorkflowCmd,
}