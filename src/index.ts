import mx from './core/Majax'

// if bundle with mountWindow
(function (global) {
    global['mx'] = mx
})(window)

export default mx