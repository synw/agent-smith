import { Command } from 'commander';
import { readCmds } from "../sys/read_cmds.js";
import { FeatureSpec } from '../../interfaces.js';

async function initUserCmds(cmdFeats: Record<string, FeatureSpec>): Promise<Array<Command>> {
    const paths = new Set<string>();
    const cmds = new Array<Command>();
    for (const feat of Object.values(cmdFeats)) {
        if (paths.has(feat.path)) {
            continue
        }
        const c = await readCmds(`${feat.path}`);
        cmds.push(...c)
        paths.add(feat.path);
    }
    return cmds
}


export {
    initUserCmds
};

