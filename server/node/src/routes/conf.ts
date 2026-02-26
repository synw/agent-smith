import { createConfigFile, db, readConf, updateConfCmd } from '@agent-smith/cli';
import type Router from '@koa/router';
import type { Context, Next } from 'koa';

function getConfRoute(r: Router) {
    r.get('/conf', async (ctx: Context, next: Next) => {
        const fp = db.readFilePaths();
        let confFilePath = "";
        //let promptFilePath = "";
        for (const p of fp) {
            if (p.name == "conf") {
                confFilePath = p.path;
                break
            }
        }
        if (confFilePath == "") {
            ctx.body = "can not find config path in db";
            ctx.status = 400;
        } else {
            const { found, data } = readConf(confFilePath);
            if (!found) {
                ctx.status = 400;
                ctx.body = "config file not found at " + confFilePath;
            } else {
                ctx.body = data;
                ctx.status = 200;
            }
        }
        await next()
    })
}

function createConfRoute(r: Router) {
    r.get('/conf/create', async (ctx: Context, next: Next) => {
        let cfp: string | null = null;
        try {
            cfp = createConfigFile();
        } catch (e) {
            console.error("500", e);
            ctx.body = e;
            ctx.status = 500;
        }
        if (cfp) {
            ctx.body = cfp;
            ctx.status = 201;
            await updateConfCmd([cfp]);
        }
        await next()
    })
}

export {
    createConfRoute, getConfRoute
};
