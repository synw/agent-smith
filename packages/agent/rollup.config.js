import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

//const isProduction = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.ts',
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
    "@locallm/api"
  ]
};