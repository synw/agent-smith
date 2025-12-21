import { WorkflowStep } from "../../../interfaces.js";
import { executeAction } from "../actions/cmd.js";
import { executeAdaptater } from "../adaptaters/cmd.js";
import { parseCommandArgs } from "../options_parsers.js";
import { executeTask } from "../tasks/cmd.js";
import { getTaskPrompt } from "../tasks/utils.js";
import { readWorkflow } from "./read.js";
import colors from "ansi-colors";

async function executeWorkflow(wname: string, args: any, options: Record<string, any> = {}): Promise<any> {
    const { workflow, found } = await readWorkflow(wname);
    if (!found) {
        throw new Error(`Workflow ${wname} not found`)
    }
    const isDebug = options?.debug === true;
    const isVerbose = options?.verbose === true;
    const stepNames = Object.keys(workflow);
    if (isDebug || isVerbose) {
        console.log("Running workflow", wname, stepNames.length, "steps");
    }
    let i = 0;
    const finalTaskIndex = stepNames.length - 1;
    let taskRes: Record<string, any> = { cmdArgs: args };
    //console.log("WPARAMS", taskRes);
    let prevStepType: "task" | "adaptater" | "action" | null = null;
    for (const [name, step] of Object.entries(workflow)) {
        if (isDebug || isVerbose) {
            console.log(i + 1, name, colors.dim(step.type))
        }
        switch (step.type) {
            case "task":
                try {
                    //console.log("WF BEFORE TASK res:", name, taskRes);

                    let pr: string | null = null;
                    if (i == 0) {
                        pr = await getTaskPrompt(name, taskRes.cmdArgs, options);
                    } else {

                        if (prevStepType) {
                            if (prevStepType == "task") {
                                pr = taskRes.answer.text;
                            }
                        }
                        if (!pr) {
                            if (taskRes?.prompt) {
                                pr = taskRes.prompt;
                            }
                        }
                    }
                    if (!pr) {
                        throw new Error(`Workflow ${wname} step ${i + 1}: provide a prompt for the task ${name}`)
                    }
                    const tr = await executeTask(name, { prompt: pr }, options, true);
                    //console.log("WF AFTER TASK RES", tr);
                    taskRes = { ...tr, ...taskRes };
                    //console.log("WF TASK NEXT ARGS", taskRes);
                } catch (e) {
                    throw new Error(`workflow task ${i + 1}: ${e}`)
                }
                break;
            case "action":
                try {
                    //console.log("EXEC ACTION ARGS", taskRes);
                    const actArgs = i == 0 ? taskRes.cmdArgs : taskRes;
                    const ares = await executeAction(name, actArgs, options, true);
                    //console.log("WF ACTION RES", typeof ares, ares);
                    if (typeof ares == "string" || Array.isArray(ares)) {
                        taskRes.args = ares;
                        //console.log("ARRAY ACTION RES", taskRes)
                    } else {
                        taskRes = { ...ares, ...taskRes };
                    }
                    //console.log("LAST ACT", i, finalTaskIndex);
                    if (i == finalTaskIndex) {
                        console.log(taskRes);
                    }
                } catch (e) {
                    throw new Error(`workflow action ${i + 1}: ${e}`)
                }
                break;
            case "adaptater":
                try {
                    //console.log("WF AD ARGS IN", taskRes);
                    //console.log("AD OPTS IN", options);
                    const actArgs = i == 0 ? taskRes.cmdArgs : taskRes;
                    const adres = await executeAdaptater(name, actArgs, options);
                    //console.log("WF AD RES", typeof adres, adres);
                    if (typeof adres == "string" || Array.isArray(adres)) {
                        taskRes.args = adres;
                        //console.log("WF AD IT RES", taskRes);
                    } else {
                        taskRes = { ...adres, ...taskRes };
                    }
                    //console.log("WF AD FINAL RES", taskRes);
                    //console.log("LAST ACT", i, finalTaskIndex);
                    if (i == finalTaskIndex) {
                        console.log(taskRes);
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
        prevStepType = step.type;
        //console.log("WF NODE RES", step.type, taskRes);
        /*if (isDebug) {
            console.log("->", params);
        }*/
        //console.log("WFR", taskRes)
        ++i
    }
    return taskRes
}

async function executeWorkflowCmd(name: string, wargs: Array<any>): Promise<any> {
    //console.log("WF INITIAL ARGS", typeof wargs, wargs.slice(0, -1));
    const { args, options } = parseCommandArgs(wargs);
    //console.log("WF ARGS", typeof args, args);
    //console.log("WF OPTS", options);
    return await executeWorkflow(name, args, options)
}

export {
    executeWorkflow,
    executeWorkflowCmd,
};
