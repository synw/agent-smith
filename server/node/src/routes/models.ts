import { backend } from '@agent-smith/cli';
import type Router from '@koa/router';
import type { Next, Context } from 'koa';

function getModelsCmd(r: Router) {
    r.get('/models', async (ctx: Context, next: Next) => {
        const mi = await backend.value?.modelsInfo();
        console.log("MODELS", mi);
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