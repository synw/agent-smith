import { getConfigPath, init } from '@agent-smith/cli';
import type Router from '@koa/router';
import type { Next, Context } from 'koa';
import fs from "node:fs";

function getStateRoute(r: Router) {
    r.get('/state', async (ctx: Context, next: Next) => {
        //console.log('STATE URL --> ' + ctx.request.url);
        //console.log("STATE ROUTE");
        const { confDir, dbPath } = getConfigPath("agent-smith", "config.db");
        //console.log("conf paths", confDir, dbPath);
        if (!fs.existsSync(dbPath)) {
            ctx.body = "no db found at " + dbPath;
            ctx.status = 202;
        } else {
            ctx.status = 200;
            await init()
        }
        //console.log("STATE", ctx.status)
        //return next()
    })
}

export {
    getStateRoute,
}