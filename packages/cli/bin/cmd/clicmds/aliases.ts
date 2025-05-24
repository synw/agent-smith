import { readAliases } from "../../db/read.js";
import { Command } from "commander";
import { actionOptions, taskOptions, workflowOptions } from "../options.js";
import { executeTaskCmd } from "../lib/tasks/cmd.js";
import { executeActionCmd } from "../lib/actions/cmd.js";
import { executeWorkflowCmd } from "../lib/workflows/cmd.js";

function initCommandsFromAliases(program: Command): Command {
    const aliases = readAliases();
    aliases.forEach((alias) => {
        switch (alias.type) {
            case "task":
                const tcmd = program.command(`${alias.name} [prompt]`)
                    .description("task: " + alias.name)
                    .action(async (...args: Array<any>) => {
                        await executeTaskCmd(alias.name, args);
                    });
                taskOptions.forEach(o => tcmd.addOption(o));
                break;
            case "action":
                const acmd = program.command(`${alias.name} [args...]`)
                    .description("action: " + alias.name)
                    .action(async (...args: Array<any>) => {
                        await executeActionCmd(alias.name, args)
                    });
                actionOptions.forEach(o => acmd.addOption(o))
                break;
            case "workflow":
                const wcmd = program.command(`${alias.name} [args...]`)
                    .description("workflow: " + alias.name)
                    .action(async (...args: Array<any>) => {
                        executeWorkflowCmd(alias.name, args)
                    });
                workflowOptions.forEach(o => wcmd.addOption(o));
        }
    });
    return program
}

export {
    initCommandsFromAliases,
}