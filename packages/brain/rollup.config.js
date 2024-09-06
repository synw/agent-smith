import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

//const isProduction = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.ts',
  output: [
    {
      file: 'dist/main.es.js',
      format: 'esm'
    },
    {
      file: 'dist/main.min.js',
      format: 'iife',
      name: '$agentbrain',
      plugins: [terser({ format: { comments: false } })]
    }],
  plugins: [
    typescript(),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
  ],
};