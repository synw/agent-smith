import { isDebug, isVerbose } from "../../../state/state.js";
import { readWorkflow } from "./read.js";
import { executeTaskCmd } from "../tasks/cmd.js";
import { executeActionCmd } from "../actions/cmd.js";
import { executeAdaptaterCmd } from "../adaptaters/cmd.js";

async function executeWorkflowCmd(name: string, args: Array<any> = [], options: any = {}): Promise<any> {
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
    let taskRes: any = {};
    for (const [name, step] of Object.entries(workflow)) {
        if (isDebug.value || isVerbose.value) {
            console.log(`${i + 1}: ${step.type} ${name}`)
        }
        const p: Array<any> | Record<string, any> = i == 0 ? [name, ...args] : { name: name, ...params };
        //console.log("P", p);
        switch (step.type) {
            case "task":
                try {
                    //console.log("EXECT", p);
                    const tr = await executeTaskCmd(p, options);
                    taskRes = tr;
                } catch (e) {
                    throw new Error(`workflow task ${i + 1}: ${e}`)
                }
                break;
            case "action":
                try {
                    //console.log("WP", p);
                    const ares = await executeActionCmd(p, options, true);
                    taskRes = ares;
                    if (i == finalTaskIndex) {
                        //console.log("LAST ACT", i, finalTaskIndex, p);
                        console.log(taskRes);
                    }
                } catch (e) {
                    throw new Error(`workflow action ${i + 1}: ${e}`)
                }
                break;
            case "adaptater":
                try {
                    //console.log("AD ARGS IN", p);
                    //console.log("AD OPTS IN", options);
                    const ares = await executeAdaptaterCmd(p, options);
                    //console.log("WF ADAPT RES", ares);
                    taskRes = ares;
                } catch (e) {
                    throw new Error(`workflow adaptater ${i + 1}: ${e}`)
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
                throw new Error(`unknown task type ${step.type} in workflow ${name}`)
        }
        params = taskRes;
        /*if (isDebug.value) {
            console.log("->", params);
        }*/
        //console.log("WFR", taskRes)
        ++i
    }
    return taskRes
}

export {
    executeWorkflowCmd,
}