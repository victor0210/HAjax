import alias from 'rollup-plugin-alias'
import typescript from 'rollup-plugin-typescript'
import aliasConfig from '../alias'
import resolve from 'rollup-plugin-node-resolve'

let plugins = [
  typescript(),
  alias({
    resolve: ['.ts', '.js'],
    aliasConfig
  }),
  resolve({
    browser: true
  })
]

export default plugins
