import copy from 'rollup-plugin-copy-glob'
import base from '../rollup.config'

base[0].plugins.push(copy([
  { files: 'src/**', dest: 'release' }
], { verbose: true, watch: true }))

export default base
