import { backend } from '@agent-smith/cli';
import type Router from '@koa/router';
import type { ModelConf } from '@locallm/types';
import type { Next, Context } from 'koa';

function getModelsCmd(r: Router) {
    r.get('/models', async (ctx: Context, next: Next) => {
        let mi: ModelConf<Record<string, any>>[] | undefined;
        try {
            mi = await backend.value?.modelsInfo();
        } catch (e) {
            ctx.body = "error reading the models";
            ctx.status = 502;
            await next();
            return
        }
        const ms: Record<string, { status: string, ctx: number }> = {};
        mi?.forEach(m => {
            let prevArg = "";
            let ctx = 0;
            if (backend.value?.providerType == "openai") {
                ms[m.name] = { status: "unknown", ctx: m?.ctx ?? ctx }
            } else {
                //@ts-ignore            
                m.extra.status.args.forEach(a => {
                    if (prevArg == "--ctx-size") {
                        ctx = parseInt(a)
                    }
                    //@ts-ignore
                    ms[m.name] = { status: m.extra.status.value, ctx: ctx }
                    prevArg = a;
                });
            }
        })
        ctx.body = ms;
        ctx.status = 200;
        await next();
    })
}

export {
    getModelsCmd,
}