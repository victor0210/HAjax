export default {
    // url prefix
    baseUrl: null,

    // global config
    config: {},

    // request headers
    headers: {},

    // auto force send cookie auth to server
    // default false
    withCredentials: false,

    // request time out cancel: callback to catch function
    timeout: null,

    // request if block
    // true will block the reset of requests in requests queue,
    // which is wonderful in the pre request such as getting some auth info before
    // default false
    block: false
}