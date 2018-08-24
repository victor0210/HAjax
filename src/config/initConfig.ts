export default {
    // url prefix
    baseUrl: null,

    // global config
    config: {},

    // request headers
    headers: {
        'Content-Type': 'application/json'
    },

    // auto force send cookie auth to server
    // default false
    withCredentials: false,

    // request time out cancel: callback to catch function
    timeout: null,

    // responseType
    responseType: 'json',

    // storeStrategy
    storeStrategy: null
}