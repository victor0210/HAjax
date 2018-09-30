import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript'
import alias from 'rollup-plugin-alias'
import resolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'
import aliasConfig from './build/alias'

const env = process.env.NODE_ENV

let plugins = [
  babel(),
  typescript(),
  alias({
    resolve: ['.ts', '.js'],
    aliasConfig
  }),
  resolve({
    browser: true
  })
]

let moduleConfig = {
  input: 'src/index.ts',
  output: [
    {
      format: 'umd',
      file: 'dist/modules/hx.umd.js',
      name: 'umd'
    },
    {
      format: 'amd',
      file: 'dist/modules/hx.amd.js',
      name: 'amd'
    },
    {
      format: 'es',
      file: 'dist/modules/hx.es.js',
      name: 'es'
    },
    {
      format: 'cjs',
      file: 'dist/modules/hx.cjs.js',
      name: 'cjs'
    }
  ],
  plugins: [...plugins]
}

let injectWindowConfig = {
  input: 'src/script.ts',
  output: {
    file: 'dist/hx.min.js',
    format: 'iife'
  },
  moduleName: 'min',
  plugins: [...plugins]
}

const config = [
  moduleConfig,
  injectWindowConfig
]

if (env === 'production') {
  injectWindowConfig.plugins.push(
    uglify()
  )
}

export default config
