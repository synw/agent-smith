#!/usr/bin/env node

import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from "koa-bodyparser";
import cors from '@koa/cors';
import { useRouter } from './router.js';
/* import { argv } from 'process';

let env = "production";

if (argv.length > 2) {
  for (const arg of argv.slice(2, argv.length)) {
    if (arg == "-d") {
      env = "dev"
    }
  }
}*/

const app = new Koa();

app.use(bodyParser());

app.use(cors({
  credentials: true
}));

function runserver(routes?: ((r: Router) => void)[]) {
  const router = useRouter(routes);
  app.use(router.routes()).use(router.allowedMethods());
  app.listen(5184, () => {
    console.log('Please open localhost:5184 in a browser');
  });
}

export { runserver }
