import initMixin from '../mixins/initMixin'
import requestMixin from '../mixins/requestMixin'
import {initConfig, initFlow} from "./initer";

//global api
function MAJAX(config = {}) {
    initConfig(config)
    initFlow()
}

initMixin()
requestMixin()

export default MAJAX
