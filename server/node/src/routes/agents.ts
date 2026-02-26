import { db, fs } from '@agent-smith/cli';
import type Router from '@koa/router';
import type { Next, Context } from 'koa';

function getAgentsRoute(r: Router) {
    r.get('/agents', async (ctx: Context, next: Next) => {
        const agents = db.readFeaturesType("agent");
        ctx.body = agents;
        ctx.status = 200;
        await next()
    })
}

function getAgentRoute(r: Router) {
    r.get('/agent/:id', async (ctx: Context, next: Next) => {
        //console.log(ctx.params.id)
        const taskSpec = fs.openTaskSpec(ctx.params.id, true);
        ctx.body = taskSpec.taskFileSpec;
        ctx.status = 200;
        await next()
    })
}

export {
    getAgentRoute,
    getAgentsRoute,
}