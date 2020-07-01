import typescript from "rollup-plugin-typescript2";
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import builtins from 'builtin-modules'

import pkg from './package.json'

const input = 'src/index.ts'
const external = ['react', ...builtins]
const plugins = [
  typescript({
    typescript: require("typescript"),
  }),
  json(),
  resolve(),
  commonjs(),
  babel({ babelHelpers: 'bundled' }),
]

export default 
  {
    input,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: "esm",
        exports: 'named',
        sourcemap: true,
      }
    ],
    external,
    plugins
  }

