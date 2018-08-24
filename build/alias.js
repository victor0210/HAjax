import { resolve } from 'path'

const r = path => resolve(__dirname, path)

export default {
  core: r('src/core'),
  config: r('src/config')
}
