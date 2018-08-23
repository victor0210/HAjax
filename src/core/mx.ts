import MAJAX from './majax'
import interceptorMixin from "../mixins/interceptorMixin";

function MX () {}

MX.prototype = new MAJAX()
MX.prototype.constructor = MX

interceptorMixin()

export default MX