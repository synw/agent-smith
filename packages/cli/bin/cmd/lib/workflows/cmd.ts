import { isDebug, isVerbose } from "../../../state/state.js";
import { readWorkflow } from "./read.js";
import { executeTaskCmd } from "../tasks/cmd.js";
import { executeActionCmd } from "../actions/cmd.js";
import { executeAdaptaterCmd } from "../adaptaters/cmd.js";

async function executeWorkflowCmd(name: string, wargs: Array<any> | Record<string, any> = [], options: any = {}): Promise<any> {
    const { workflow, found } = await readWorkflow(name);
    if (!found) {
        throw new Error(`Workflow ${name} not found`)
    }
    const args = wargs;
    args.pop();
    console.log("WARGS", args);
    //console.log("WFCMD", workflow);
    const stepNames = Object.keys(workflow);
    if (isDebug.value || isVerbose.value) {
        console.log("Running workflow", name, stepNames.length, "steps");
    }
    let params: Record<string, any> = Array.isArray(args) ? {} : args;
    let i = 0;
    const finalTaskIndex = stepNames.length + 1;
    let taskRes: any = {};
    for (const [name, step] of Object.entries(workflow)) {
        if (isDebug.value || isVerbose.value) {
            console.log(`${i + 1}: ${step.type} ${name}`)
        }
        // @ts-ignore
        let pval: Array<any> | Record<string, any> = new Array<any>();
        if (i == 0) {
            pval = [name, ...args as Array<any>]
        } else {
            if (Array.isArray(params)) {
                pval = [name, ...params]
            } else {
                pval = { name: name, ...params }
            }
        }
        //const p: Array<any> | Record<string, any> = i == 0 ? [name, ...args] : { name: name, ...params };
        //console.log("P", p);
        switch (step.type) {
            case "task":
                try {
                    //console.log("EXECT", pval);
                    const tr = await executeTaskCmd(pval, options);
                    taskRes = tr;
                } catch (e) {
                    throw new Error(`workflow task ${i + 1}: ${e}`)
                }
                break;
            case "action":
                try {
                    //console.log("EXECA", p);
                    const ares = await executeActionCmd(pval, options, true);
                    if (typeof ares == "string") {
                        // if the adaptater returns a string convert it to array to pass to the next node
                        taskRes = [ares]
                    } else {
                        taskRes = ares;
                    }
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
                    const ares = await executeAdaptaterCmd(pval, options);
                    if (typeof ares == "string") {
                        // if the adaptater returns a string convert it to array to pass to the next node
                        taskRes = [ares]
                    } else {
                        taskRes = ares;
                    }
                    //console.log("WF ADAPT RES", typeof ares, Array.isArray(ares) ? ares.length : "NA");
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
        //console.log("WF NODE RES", step.type, taskRes);
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