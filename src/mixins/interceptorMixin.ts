import MAJAX from '../core/majax'

const requestMixin = () => {
  MAJAX.prototype.requestInterceptor = (config) => {}
  MAJAX.prototype.responseInterceptor = (config) => {}
}

export default requestMixin
