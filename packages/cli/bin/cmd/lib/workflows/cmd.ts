import { executeAction } from "../actions/cmd.js";
import { executeAdaptater } from "../adaptaters/cmd.js";
import { parseCommandArgs } from "../options_parsers.js";
import { executeTask } from "../tasks/cmd.js";
import { readWorkflow } from "./read.js";

async function executeWorkflow(name: string, params: Record<string, any>, options: Record<string, any>): Promise<any> {
    const { workflow, found } = await readWorkflow(name);
    if (!found) {
        throw new Error(`Workflow ${name} not found`)
    }
    const isDebug = options?.debug === true;
    const isVerbose = options?.verbose === true;
    const stepNames = Object.keys(workflow);
    if (isDebug || isVerbose) {
        console.log("Running workflow", name, stepNames.length, "steps");
    }
    let i = 0;
    const finalTaskIndex = stepNames.length + 1;
    let taskRes: Record<string, any> = params;
    for (const [name, step] of Object.entries(workflow)) {
        if (isDebug || isVerbose) {
            console.log(`${i + 1}: ${step.type} ${name}`)
        }
        switch (step.type) {
            case "task":
                try {
                    //console.log("EXECT", pval);
                    const tr = await executeTask(name, taskRes, options, true);
                    taskRes = tr;
                } catch (e) {
                    throw new Error(`workflow task ${i + 1}: ${e}`)
                }
                break;
            case "action":
                try {
                    //console.log("EXECA", p);
                    const ares = await executeAction(name, taskRes, options, true);
                    if (typeof ares == "string") {
                        // if the adaptater returns a string convert it to array to pass to the next node
                        taskRes = { payload: ares }
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
                    const ares = await executeAdaptater(name, taskRes, options);
                    if (typeof ares == "string") {
                        // if the adaptater returns a string convert it to array to pass to the next node
                        taskRes = { payload: ares }
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
        /*if (isDebug) {
            console.log("->", params);
        }*/
        //console.log("WFR", taskRes)
        ++i
    }
    return taskRes
}

async function executeWorkflowCmd(name: string, wargs: Array<any>): Promise<any> {
    const { args, options } = parseCommandArgs(wargs);
    const params = { args: args };
    return await executeWorkflow(name, params, options)
}

export {
    executeWorkflow,
    executeWorkflowCmd,
};
