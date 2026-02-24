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
import type { WsClientMsg, WsRawServerMsg } from '@agent-smith/types';
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
  const sendTokensInterval = 100;

  const confirmToolCalls: Record<string, (value: boolean) => void> = {};

  app.ws.use(route.all('/ws', function(ctx) {
    //ctx.websocket.send('Hello World');
    let abort = new AbortController();
    ctx.websocket.on('message', async function(message: string) {
      const msg = JSON.parse(message) as WsClientMsg;
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
            const rsm: WsRawServerMsg = {
              type: "error",
              msg: `can not confirm tool call: unknown tool id ${msg.payload.id}`,
            }
            ctx.websocket.send(JSON.stringify(rsm));
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
          const rsm: WsRawServerMsg = {
            type: "error",
            msg: "provide a payload",
          }
          ctx.websocket.send(JSON.stringify(rsm));
          return
        }
        await init();
        if (msg.feature == "task") {
          let buf = "";
          msg.options.onToken = (t: string) => {
            buf += t;
            process.stdout.write(t);
          };
          try {
            const it = setInterval(() => {
              const rsm: WsRawServerMsg = {
                type: "token",
                msg: buf,
              }
              ctx.websocket.send(JSON.stringify(rsm));
              buf = "";
            }, sendTokensInterval);
            const res = await executeTask(msg.command, msg.payload, msg.options);
            setTimeout(() => {
              clearInterval(it);
            }, sendTokensInterval);
            //console.dir(res, { depth: 3 });
            let r: HistoryTurn;
            if (res.template.id == "none") {
              r = { assistant: res.answer.text };
            } else {
              r = res.template.history.pop() as HistoryTurn
            }
            const rsm: WsRawServerMsg = {
              type: "finalresult",
              msg: JSON.stringify(r),
            }
            ctx.websocket.send(JSON.stringify(rsm));
          } catch (e) {
            const rsm: WsRawServerMsg = {
              type: "error",
              msg: `${e}`,
            }
            ctx.websocket.send(JSON.stringify(rsm));
          }
        } else if (msg.feature == "agent") {
          msg.options.onToolsTurnStart = (tcs: Record<string, any>) => {
            const rsm: WsRawServerMsg = {
              type: "finalresult",
              msg: JSON.stringify(tcs),
            }
            ctx.websocket.send(JSON.stringify(rsm));
          };
          msg.options.onToolsTurnEnd = (tr: Record<string, any>) => {
            const rsm: WsRawServerMsg = {
              type: "toolsturnend",
              msg: JSON.stringify(tr),
            }
            ctx.websocket.send(JSON.stringify(rsm));
          };
          msg.options.onTurnEnd = (ht: Record<string, any>) => {
            const rsm: WsRawServerMsg = {
              type: "turnend",
              msg: JSON.stringify(ht),
            }
            ctx.websocket.send(JSON.stringify(rsm));
          };
          msg.options.onAssistant = (txt: string) => {
            const rsm: WsRawServerMsg = {
              type: "assistant",
              msg: txt,
            }
            ctx.websocket.send(JSON.stringify(rsm));
          };
          msg.options.onToolCall = (tc: Record<string, any>) => {
            if (!tc?.id) {
              tc.id = crypto.randomUUID()
            }
            const rsm: WsRawServerMsg = {
              type: "toolcall",
              msg: JSON.stringify(tc),
            }
            ctx.websocket.send(JSON.stringify(rsm));
            console.log("\n⚒️ ", color.bold(msg.command), "=>", `${color.yellowBright(tc.name)}`, tc.arguments);
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
              toolResData = tr.toString();
            }
            const rsm: WsRawServerMsg = {
              type: "toolcallend",
              msg: `${id}<|xtool_call_id|>` + toolResData,
            }
            ctx.websocket.send(JSON.stringify(rsm));
          }
          msg.options.confirmToolUsage = async (tc: Record<string, any>) => {
            if (!tc?.id) {
              tc.id = crypto.randomUUID()
            }
            const rsm: WsRawServerMsg = {
              type: "toolcallconfirm",
              msg: JSON.stringify(tc),
            }
            const { promise, resolve } = createManualPromise<boolean>();
            confirmToolCalls[tc.id] = resolve;
            ctx.websocket.send(JSON.stringify(rsm));
            const res = await promise;
            return res
          }
          msg.options.isAgent = true;
          try {
            let buf = "";
            msg.options.onToken = (t: string) => {
              buf += t;
              process.stdout.write(t);
            };
            const it = setInterval(() => {
              if (buf == "") { return };
              const rsm: WsRawServerMsg = {
                type: "token",
                msg: buf,
              }
              ctx.websocket.send(JSON.stringify(rsm));
              buf = "";
            }, sendTokensInterval);
            const res = await executeTask(msg.command, msg.payload, msg.options);
            setTimeout(() => {
              clearInterval(it);
            }, sendTokensInterval);
            const ht = JSON.stringify(res.template.history.pop());
            //console.log("FINAL MSG", ht)
            const rsm: WsRawServerMsg = {
              type: "finalresult",
              msg: ht,
            }
            ctx.websocket.send(JSON.stringify(rsm));
          } catch (e) {
            const rsm: WsRawServerMsg = {
              type: "error",
              msg: `${e}`
            }
            ctx.websocket.send(JSON.stringify(rsm));
          }
        } else if (msg.feature == "workflow") {
          try {
            const res = await executeWorkflow(msg.command, msg.payload, msg.options);
            const rsm: WsRawServerMsg = {
              type: "finalresult",
              msg: res,
            }
            ctx.websocket.send(JSON.stringify(rsm));
          } catch (e) {
            const rsm: WsRawServerMsg = {
              type: "error",
              msg: `${e}`
            }
            ctx.websocket.send(JSON.stringify(rsm));
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
          const rsm: WsRawServerMsg = {
            type: "error",
            msg: "command type " + msg.feature + " not supported"
          }
          ctx.websocket.send(JSON.stringify(rsm));
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
