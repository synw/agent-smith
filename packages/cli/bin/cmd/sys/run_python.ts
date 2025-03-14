import { NodeReturnType } from '../../interfaces.js';
import { Options, PythonShell } from 'python-shell';

async function runPyScript(
  rsShell: PythonShell,
  pythonPath: string,
  scriptPath: string,
  scriptArgs: Array<string>,
  onEmitLine?: CallableFunction): Promise<NodeReturnType<Array<string>>> {
  const _options: Options = {
    mode: "text",
    pythonPath: pythonPath,
    pythonOptions: ['-u'],
    args: scriptArgs,
  };
  let promiseResolve: (value: unknown) => void;
  let promise = new Promise((resolve) => promiseResolve = resolve);
  rsShell = new PythonShell(scriptPath, _options);
  const res: NodeReturnType<Array<string>> = { data: new Array<string>() };
  function handleLine(msg: string) {
    if (onEmitLine) {
      onEmitLine(msg);
    }
    res.data.push(msg);
  }

  rsShell.on('message', function (message) {
    handleLine(message);
  });
  /*rsShell.on('stderr', function (err) {
    console.log("STDERR", err);
  });*/
  rsShell.on('pythonError', function (err) {
    console.log("PYERR", `${err.message}, ${err.traceback}`);
    res.error = new Error(err.traceback.toString());
    //promiseResolve(true)
  });
  rsShell.end(function (err, code, signal) {
    //console.log("END", code, signal);
    promiseResolve(true);
  });
  await promise;
  return res;
}

export { runPyScript };