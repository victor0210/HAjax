import hx from './core/HAjax'

// if bundle with mountWindow
(function (global) {
    global['hx'] = new hx()
})(window)
