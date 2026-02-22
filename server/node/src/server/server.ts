#!/usr/bin/env node
import { default as color } from "ansi-colors";
import Koa, { type Next } from 'koa';
import { Router } from "@koa/router";
import bodyParser from "koa-bodyparser";
import cors from '@koa/cors';
import { useRouter } from './router.js';
import websockify from 'koa-websocket';
import route from 'koa-route';
import serve from "koa-static";
import { executeTask, executeWorkflow, init } from '@agent-smith/cli';
import type { ClientMsg } from '@agent-smith/types';
import type { Context } from "node:vm";
import type { HistoryTurn } from "@locallm/types";
/* import { argv } from 'process';

let env = "production";

if (argv.length > 2) {
  for (const arg of argv.slice(2, argv.length)) {
    if (arg == "-d") {
      env = "dev"
    }
  }
}*/

const logger = async (ctx: Context, next: Next) => {
  const start = Date.now(); await next();
  const duration = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${duration}ms`);
};

const app = websockify(new Koa());

app.use(bodyParser());
app.use(logger);
app.use(cors({
  credentials: true
}));

app.ws.use(function(ctx, next) {
  return next();
});

function createManualPromise<T>() {
  let resolveFn: (value: T) => void;
  let rejectFn: (reason?: any) => void;

  const promise = new Promise<T>((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  return {
    promise,
    resolve: resolveFn!,
    reject: rejectFn!
  };
}

function runserver(routes?: ((r: Router) => void)[], staticDir?: string) {
  if (staticDir) {
    app.use(serve(staticDir));
  }
  const router = useRouter(routes);
  const sep = "<|xmsgtype|>";

  const confirmToolCalls: Record<string, (value: boolean) => void> = {};

  app.ws.use(route.all('/ws', function(ctx) {
    //ctx.websocket.send('Hello World');
    let abort = new AbortController();
    ctx.websocket.on('message', async function(message: string) {
      const msg = JSON.parse(message) as ClientMsg;
      if (!msg?.options) {
        msg.options = {}
      }
      //console.log("ABO", abort);
      msg.options.abort = abort;
      //console.log(msg)
      if (msg.type == "system") {
        if (msg.command == "stop") {
          //console.log("STOP CMD");
          abort.abort("stopped");
          abort = new AbortController();
          return
        } else if (msg.command == "confirmtool") {
          if (!(msg.payload.id in confirmToolCalls)) {
            ctx.websocket.send(`error${sep}can not confirm tool call: unknown tool id ${msg.payload.id}`);
            return
          }
          if (msg.payload.confirm == true) {
            confirmToolCalls[msg.payload.id](true);
          } else {
            confirmToolCalls[msg.payload.id](false);
          }
          delete confirmToolCalls[msg.payload.id];
        }
        else {
          console.error(`unknown system command ${msg.payload}`)
        }
      } else {
        if (!msg?.payload) {
          ctx.websocket.send(`error${sep}provide a payload`);
          return
        }
        await init();
        if (msg.feature == "task") {
          let buf = "";
          msg.options.onToken = (t: string) => {
            //process.stdout.write(t);
            buf += t
          };
          try {
            const it = setInterval(() => {
              const m = `token${sep}${buf}`;
              ctx.websocket.send(m);
              buf = "";
            }, 100);
            const res = await executeTask(msg.command, msg.payload, msg.options);
            clearInterval(it);
            //console.dir(res, { depth: 3 });
            let r: HistoryTurn;
            if (res.template.id == "none") {
              r = { assistant: res.answer.text };
            } else {
              r = res.template.history.pop() as HistoryTurn
            }
            ctx.websocket.send(`finalresult${sep}` + JSON.stringify(r))
          } catch (e) {
            ctx.websocket.send(`error${sep}${e}`);
          }
        } else if (msg.feature == "agent") {
          msg.options.onToolsTurnStart = (tcs: Record<string, any>) => {
            const m = `toolsturnstart${sep}` + JSON.stringify(tcs);
            ctx.websocket.send(m);
          };
          msg.options.onToolsTurnEnd = (tr: Record<string, any>) => {
            const m = `toolsturnend${sep}` + JSON.stringify(tr);
            ctx.websocket.send(m);
          };
          msg.options.onTurnEnd = (ht: Record<string, any>) => {
            const m = `turnend${sep}` + JSON.stringify(ht);
            ctx.websocket.send(m);
          };
          msg.options.onAssistant = (txt: string) => {
            const m = `assistant${sep}` + txt;
            ctx.websocket.send(m);
          };
          msg.options.onToolCall = (tc: Record<string, any>) => {
            if (!tc?.id) {
              tc.id = crypto.randomUUID()
            }
            const m = `toolcall${sep}` + JSON.stringify(tc);
            ctx.websocket.send(m);
            console.log("⚒️ ", color.bold(msg.command), "=>", `${color.yellowBright(tc.name)}`, tc.arguments);
          };
          msg.options.onToolCallEnd = (id: string, tr: any) => {
            let toolResData: any;
            if (typeof tr == 'object') {
              if (tr?.answer?.text) {
                // comes from an inference task
                toolResData = tr.answer.text
              } else {
                toolResData = JSON.stringify(tr)
              }
            } else {
              toolResData = tr;
            }
            const m = `toolcallend${sep}${id}<|xtool_call_id|>` + toolResData;
            ctx.websocket.send(m);
          }
          msg.options.confirmToolUsage = async (tc: Record<string, any>) => {
            if (!tc?.id) {
              tc.id = crypto.randomUUID()
            }
            const m = `toolcallconfirm${sep}` + JSON.stringify(tc);
            const { promise, resolve, reject } = createManualPromise<boolean>();
            confirmToolCalls[tc.id] = resolve;
            ctx.websocket.send(m);
            const res = await promise;
            return res
          }
          msg.options.isAgent = true;
          try {
            let buf = "";
            msg.options.onToken = (t: string) => {
              process.stdout.write(t);
              buf += t
            };
            const it = setInterval(() => {
              const m = `token${sep}${buf}`;
              ctx.websocket.send(m);
              buf = "";
            }, 150);
            const res = await executeTask(msg.command, msg.payload, msg.options);
            clearInterval(it);
            const ht = JSON.stringify(res.template.history.pop());
            //console.log("FINAL MSG", ht)
            ctx.websocket.send(`finalresult${sep}` + ht)
          } catch (e) {
            ctx.websocket.send(`error${sep}${e}`);
          }
        } else if (msg.feature == "workflow") {
          try {
            const res = await executeWorkflow(msg.command, msg.payload, msg.options);
            ctx.websocket.send(`finalresult${sep}${res}`)
          } catch (e) {
            ctx.websocket.send(`error${sep}${e}`);
          }
        }
        /*else if (msg.type == "cmd") {
          await init();
          msg.options.onToken = (t: string) => {
            process.stdout.write(t);
            ctx.websocket.send(t);
          };
          await executeCmd(msg.name, msg.payload, msg.options);
        }*/
        else {
          ctx.websocket.send("command type " + msg.feature + " not supported");
        }
      }
      abort = new AbortController();
    });
  }));

  app.use(router.routes()).use(router.allowedMethods());
  app.listen(5184, () => {
    console.log('Please open localhost:5184 in a browser');
  });
}

export { runserver }
