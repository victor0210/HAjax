import MAJAX from '../core/majax'

const requestMixin = () => {
    const $this = MAJAX.prototype

    const _request = (config) => {
        $this.flow.action(config)
    }

    $this.request = (config) => {
        _request(Object.assign({}, config))
    }

    $this.get = (url, config) => {
        _request({
            ...config,
            url: url,
            method: 'get'
        })
    }

    $this.post = (url, config) => {
        _request({
            ...config,
            url: url,
            method: 'post'
        })
    }
}

export default requestMixin
