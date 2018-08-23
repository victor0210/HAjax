import MX from '../core/mx'

const requestMixin = () => {
  MX.prototype.requestInterceptor = (config) => {}
  MX.prototype.responseInterceptor = (config) => {}
}

export default requestMixin
