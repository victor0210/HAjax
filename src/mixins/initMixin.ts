import MAJAX from '../core/majax'
import {initConfig, initFlow} from "../core/initer";

const initMixin = () => {
    const $this = MAJAX.prototype

    const _create = (config) => {
        // create instance method

        return new MAJAX(config)
    }

    $this.create = (config) => {
        return _create(config)
        // create api
    }
}

export default initMixin
