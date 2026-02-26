import { db, fs } from '@agent-smith/cli';
import type Router from '@koa/router';
import type { Next, Context } from 'koa';

function getTasksRoute(r: Router) {
    r.get('/tasks', async (ctx: Context, next: Next) => {
        const tasks = db.readFeaturesType("task");
        ctx.body = tasks;
        ctx.status = 200;
        await next()
    })
}

function getTaskRoute(r: Router) {
    r.get('/task/:id', async (ctx: Context, next: Next) => {
        //console.log(ctx.params.id)
        const taskSpec = fs.openTaskSpec(ctx.params.id);
        ctx.body = taskSpec.taskFileSpec;
        ctx.status = 200;
        await next()
    })
}
function saveTasksRoute(r: Router) {
    r.post('/save', async (ctx: Context, next: Next) => {
        //const payload = ctx.request.body;

        ctx.body = "ok";
        ctx.status = 200;
        await next()
    })
}


export {
    getTasksRoute,
    getTaskRoute,
}