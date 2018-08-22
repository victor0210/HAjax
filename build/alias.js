import { resolve } from 'path'

const r = path => resolve(__dirname, path)

export default {
  core: r('src/core'),
  mixins: r('src/mixins'),
  implements: r('src/implements'),
  flows: r('src/flows')
}
