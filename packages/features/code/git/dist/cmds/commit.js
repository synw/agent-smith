import { writeFileSync } from "fs";
import select from '@inquirer/select';
//import { execute, executeWorkflowCmd, writeToClipboard, initAgent, initState, parseInferenceArgs } from "@agent-smith/cli";
import { execute, executeWorkflowCmd, writeToClipboard, initAgent, initState, parseInferenceArgs } from "../../../../../cli/dist/main.js";

function extractBetweenTags(
    text,
    startTag,
    endTag,
) {
    try {
        // Find start position
        const startIndex = text.indexOf(startTag);
        if (startIndex === -1) return text;

        // Calculate content boundaries
        let contentStart = startIndex + startTag.length;
        let contentEnd;

        if (endTag) {
            contentEnd = text.indexOf(endTag, contentStart);
            if (contentEnd === -1) return text;
        } else {
            // Find next newline for self-closing tags
            contentEnd = text.indexOf('\n', contentStart);
            if (contentEnd === -1) contentEnd = text.length;
        }

        // Extract content
        return text.substring(contentStart, contentEnd).trim();
    } catch (error) {
        throw new Error(`Error parsing content between tags ${startTag} ${endTag}: ${error}`);
    }
}

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

async function runCmd(args = [], options) {
    await initState();
    const isUp = await initAgent();
    if (!isUp) {
        throw new Error("No inference server found, canceling")
    }
    let wf = "git_commit";
    const nargs = [];
    let gitArgs = [];
    for (const arg of args) {
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
    const res = await executeWorkflowCmd(wf, [...gitArgs, ...nargs], options);
    //console.log("RES", res);
    if ("error" in res) {
        console.log(res);
        throw new Error(`workflow ${wf} execution error: ${res.error}`)
    }
    //console.log("JOB RES", res);
    //const final = res.answer.text.replace("```", "").trim();
    const sresp = res.answer.text.split("</think>");
    const resp = sresp.length == 1 ? sresp[0] : sresp[1];
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
