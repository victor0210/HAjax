import { uglify } from 'rollup-plugin-uglify'
import copy from 'rollup-plugin-copy-glob'
import base from '../rollup.config'

base[0].plugins.push(uglify())
base[0].plugins.push(copy([
  { files: 'src/**', dest: 'release' },
  { files: 'package.json', dest: 'release' },
  { files: 'README.md', dest: 'release' }
]))

export default base
