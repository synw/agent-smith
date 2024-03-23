import Router from 'koa-router';

const useRouter = (
  routes: Array<(r: Router) => void> = [],
) => {
  const router = new Router();

  routes.forEach((f) => f(router));

  router.get('/ping', async (ctx, next) => {
    ctx.body = { ok: true };
    ctx.status = 200;
  });

  /*router.all('(.*)', async (ctx) => {
    ctx.status = 200;
    ctx.body = await fs.promises.readFile(path.join(dirpath, '../../index.html'), 'utf8');
  });*/

  return router
}

export { useRouter }