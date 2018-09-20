import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript'
import alias from 'rollup-plugin-alias'
import resolve from 'rollup-plugin-node-resolve'
import aliasConfig from './build/alias'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
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
}
