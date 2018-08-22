import initMixin from '../mixins/initMixin'
import requestMixin from '../mixins/requestMixin'
import interceptorMixin from '../mixins/interceptorMixin'
import {initConfig, initFlow} from "./initer";

function MAJAX(config = {}) {
    initConfig(config)
    initFlow()
}

initMixin()
requestMixin()
interceptorMixin()

export default MAJAX
