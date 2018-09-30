import mx from './core/Majax'

// if bundle with mountWindow
(function (global) {
    global['mx'] = new mx()
})(window)
