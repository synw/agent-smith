import { Options, PythonShell } from 'python-shell';

async function runPyScript(
  rsShell: PythonShell,
  pythonPath: string,
  scriptPath: string,
  scriptArgs: Array<string>,
  handleOutputFrom: "msg" | "stderr" = "msg",
  onEmitLine?: CallableFunction) {
  const _options: Options = {
    mode: "text",
    pythonPath: pythonPath,
    pythonOptions: ['-u'],
    args: scriptArgs,
  };
  let promiseResolve: (value: unknown) => void;
  let promise = new Promise((resolve) => promiseResolve = resolve);
  rsShell = new PythonShell(scriptPath, _options);
  const msgs = new Array<string>();
  function handleLine(msg: string) {
    if (onEmitLine) {
      onEmitLine(msg);
    }
    msgs.push(msg);
  }
  rsShell.on('message', function (message) {
    if (handleOutputFrom == "msg") {
      handleLine(message);
    }
  });
  rsShell.on('stderr', function (err) {
    console.log("STDERR", err);
    if (handleOutputFrom == "stderr") {
      handleLine(err);
    } else {
      promiseResolve(true);
    }
  });
  rsShell.on('pythonError', function (err) {
    console.log("PYERR", `${err.message}, ${err.traceback}`);
    promiseResolve(true)
  });
  rsShell.end(function (err, code, signal) {
    //console.log("END", code, signal);
    promiseResolve(true);
  });
  await promise;
  return msgs;
}

export { runPyScript };