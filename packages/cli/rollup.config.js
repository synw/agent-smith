import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

//const isProduction = !process.env.ROLLUP_WATCH;

export default {
  input: 'bin/main.ts',
  output: [
    {
      file: 'dist/main.js',
      format: 'esm'
    }],
  plugins: [
    typescript(),
    resolve({
      jsnext: true,
      main: true,
    }),
  ],
  external: ["@agent-smith/brain",
    "@agent-smith/jobs",
    "@agent-smith/lmtask",
    "@inquirer/prompts",
    "@inquirer/select",
    "@vue/reactivity",
    "better-sqlite3",
    "clipboardy",
    "log-update",
    "marked",
    "marked-terminal",
    "modprompt",
    "python-shell",
    "yaml"]
};