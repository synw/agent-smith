import { Command } from "commander";
import { allOptions } from "../options.js";
import { executeTaskCmd } from "../lib/tasks/cmd.js";
import { executeActionCmd } from "../lib/actions/cmd.js";
import { executeWorkflowCmd } from "../lib/workflows/cmd.js";
import { AliasType, FeatureSpec, FeatureType } from "../../interfaces.js";

function initCommandsFromAliases(program: Command, aliases: {
    name: string;
    type: AliasType;
}[],
    features: Record<FeatureType, Record<string, FeatureSpec>>
): Command {
    aliases.forEach((alias) => {
        //console.log("A", alias)
        switch (alias.type) {
            case "task":
                const tcmd = program.command(`${alias.name} [prompt_and_vars...]`)
                    .description("task: " + alias.name)
                    .action(async (...args: Array<any>) => {
                        await executeTaskCmd(alias.name, args);
                    });
                allOptions.forEach(o => tcmd.addOption(o));
                if (features.task[alias.name]?.variables) {
                    //console.log(alias.name, "VARS", features.task[alias.name]?.variables)
                    features.task[alias.name].variables?.optional.forEach(v => {
                        tcmd.option(`--${v} <value>`)
                    });
                    features.task[alias.name].variables?.required.forEach(v => {
                        tcmd.requiredOption(`--${v} <value>`)
                    });
                }
                break;
            case "action":
                const acmd = program.command(`${alias.name} [args...]`)
                    .description("action: " + alias.name)
                    .action(async (...args: Array<any>) => {
                        await executeActionCmd(alias.name, args)
                    });
                allOptions.forEach(o => acmd.addOption(o));
                break;
            case "workflow":
                const wcmd = program.command(`${alias.name} [args...]`)
                    .description("workflow: " + alias.name)
                    .action(async (...args: Array<any>) => {
                        executeWorkflowCmd(alias.name, args)
                    });
                allOptions.forEach(o => wcmd.addOption(o));
        }
    });
    return program
}

export {
    initCommandsFromAliases,
}