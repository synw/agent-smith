import Router from '@koa/router';
import type { Context, Next } from 'koa';

const useRouter = (
  routes: Array<(r: Router) => void> = [],
) => {
  const router = new Router();

  routes.forEach((f) => f(router));

  router.get('/ping', async (ctx: Context, next: Next) => {
    ctx.body = { ok: true };
    ctx.status = 200;
    await next();
  });

  return router
}

export { useRouter }