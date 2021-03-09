import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { camelCase } from 'lodash';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import copy from 'rollup-plugin-copy'

const pkg = require('./package.json');

const libraryName = 'dexe-crypto-wallet-parser';

const configs = [
  {
    input: `src/main.ts`,
    output: [
      { file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true },
      { file: pkg.module, format: 'esm', sourcemap: true },
    ],
    external: [],
    watch: {
      include: 'src/**',
    },
    plugins: [
      json(),
      typescript(),
      commonjs({ extensions: ['.js', '.ts'] }),
      sourceMaps(),
      copy({
        targets: [
          { src: 'static/dexe-crypto-wallet-parser.d.ts', dest: 'dist' },
        ]
      })
    ],
  },
  {
    input: `src/browser.ts`,
    output: [{ file: pkg.browser, name: camelCase(libraryName) + '-browser', format: 'umd', sourcemap: true }],
    external: [],
    watch: {
      include: 'src/**',
    },
    plugins: [
      json(),
      typescript(),
      commonjs({ extensions: ['.js', '.ts'] }),
      sourceMaps(),
    ],
  },
];

export default configs;
