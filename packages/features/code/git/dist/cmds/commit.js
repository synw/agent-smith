import { writeFileSync } from "fs";
import select from '@inquirer/select';
import { execute, executeWorkflowCmd, writeToClipboard, initAgent, initState, extractBetweenTags } from "@agent-smith/cli";
/*import {
    execute,
    executeWorkflowCmd,
    writeToClipboard,
    initAgent,
    initState,
    extractBetweenTags,
} from "../../../../../cli/dist/main.js";*/

const choices = [
    {
        name: 'Commit',
        value: 'commit',
        description: 'Run the commit command with this message',
    },
    {
        name: 'Copy',
        value: 'copy',
        description: 'Copy the commit message to the clipboard',
    },
    {
        name: 'Commit only the first line',
        value: 'line',
        description: 'Run the commit command with the first line of the message only',
    },
    {
        name: 'File',
        value: 'file',
        description: 'Save the commit message into a ./tmp.txt file',
    },
    {
        name: 'Cancel',
        value: 'cancel',
        description: 'Cancel the commit',
    },
];

async function runCmd(_args = [], options) {
    await initState();
    const isUp = await initAgent();
    if (!isUp) {
        throw new Error("No inference server found, canceling")
    }
    let wf = "git_commit";
    /*const { conf, vars, args } = parseArgs(_args);
    const gitArgs = [];
    const vkeys = Object.keys(vars);
    if (vkeys.includes("msg")) {
        gitArgs.msg = vars.msg;
        delete vars.msg
    }
    if (vkeys.includes("pkg")) {
        gitArgs.pkg = vars.pkg;
        delete vars.pkg
    }*/
    const nargs = [];
    let gitArgs = [];
    for (const arg of _args) {
        if (arg.startsWith("msg=")) {
            wf = "git_commit_details";
            nargs.push(arg)
        } else if (arg.startsWith("pkg=")) {
            wf = "git_commit_pkg";
            nargs.push(arg)
        } else if (arg.includes("=")) {
            nargs.push(arg)
        } else {
            gitArgs.push(arg)
        }
    }
    //const { inferenceVars } = parseInferenceArgs(nargs);
    //console.log("NARGS", nargs);
    //console.log("GIT ARGS", gitArgs);
    console.log("Generating a commit message ...");
    const res = await executeWorkflowCmd(wf, [...nargs, ...gitArgs], options);
    //console.log("RES", res);
    if ("error" in res) {
        console.log(res);
        throw new Error(`workflow ${wf} execution error: ${res.error}`)
    }
    //console.log("JOB RES", res);
    //const final = res.answer.text.replace("```", "").trim();
    let resp = res.answer.text;
    if (res.template.tags?.think) {
        const sresp = res.answer.text.split(res.template.tags.think.end);
        resp = sresp.length == 1 ? sresp[0] : sresp[1];
    }
    const final = extractBetweenTags(resp, "<commit>", "</commit>");
    console.log("\n--------------------------------------------------------");
    console.log(final);
    console.log("--------------------------------------------------------\n");
    const answer = await select({
        message: 'Select an action',
        default: "commit",
        choices: choices,
    });
    //console.log(answer);
    let flagPath = ["-a"];
    if (gitArgs.length > 0) {
        flagPath = gitArgs;
    }
    switch (answer) {
        case "copy":
            writeToClipboard(final)
            break;
        case "file":
            const tmpFile = process.cwd() + "/tmp.txt";
            writeFileSync(tmpFile, final, { flag: "w" });
            break;
        case "commit":
            const lines = final.split("\n");
            const m = `${lines.join('\n')}`;
            console.log("git commit -m", m);
            const res2 = await execute("git", ["commit", ...flagPath, "-m", m]);
            console.log(res2);
            break;
        case "line":
            const firstLine = final.split("\n")[0];
            const res3 = await execute("git", ["commit", ...flagPath, "-m", firstLine]);
            console.log(res3);
            break;
        default:
            console.log("Commit canceled");
            break;
    }
}
const cmd = {
    cmd: runCmd,
    description: "Create a git commit message from a git diff",
};

export { cmd };
