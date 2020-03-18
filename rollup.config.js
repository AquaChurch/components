import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import autoprefixer from 'autoprefixer';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import copy from 'rollup-plugin-copy';

import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    typescript(),
    postcss({
      modules: true,
      emitFile: 'dist/index.css',
      minimize: !process.env.ROLLUP_WATCH,
      plugins: [autoprefixer()],
    }),
    resolve(),
    commonjs(),
    url(),
    svgr(),
    copy({
      targets: [
        { src: 'assets/**/*', dest: 'dist/assets' }
      ]
    })
  ],
};
