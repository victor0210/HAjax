import plugins from './rollup.plugins'
import { resolve } from 'path'

const rootPath = resolve(__dirname, '../')

const r = path => resolve(rootPath, path)

export const injectWindowConfig = {
  input: r('src/script.ts'),
  output: {
    file: r('release/dist/hx.min.js'),
    format: 'iife'
  },
  moduleName: 'min',
  plugins: [...plugins]
}

export const moduleConfig = {
  input: r('src/index.ts'),
  output: [
    {
      format: 'umd',
      file: r('release/dist/hx.umd.js'),
      name: 'umd'
    },
    {
      format: 'amd',
      file: r('release/dist/hx.amd.js'),
      name: 'amd'
    },
    {
      format: 'es',
      file: r('release/dist/hx.es.js'),
      name: 'es'
    },
    {
      format: 'cjs',
      file: r('release/dist/hx.cjs.js'),
      name: 'cjs'
    }
  ],
  plugins: [...plugins]
}
