import { Command } from 'commander';
import { readCmds } from "../sys/read_cmds.js";
import { FeatureSpec } from '../../interfaces.js';

async function initUserCmds(cmdFeats: Record<string, FeatureSpec>): Promise<Array<Command>> {
    //console.log("CMDS", feats.cmds)
    const cmds = new Array<Command>();
    for (const feat of Object.values(cmdFeats)) {
        const c = await readCmds(`${feat.path}`);
        cmds.push(...c)
    }
    return cmds
}


export {
    initUserCmds
};

