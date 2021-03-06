import {RESPONSE_TYPE_JSON} from "./responseTypes";

export default {
    // url prefix
    baseURL: '/',

    // request headers
    headers: {
        'Content-Type': 'application/json'
    },

    // request server url
    url: '/',

    // mode: default: null, 'debounce', 'throttle'
    mode: null,

    // count of auto retry bad request
    retryLimit: 0,

    // buffer of retry with bad request
    retryBuffer: 3000,

    // action when mode is 'debounce'
    debounceTime: 300,

    // action when mode is 'throttle'
    throttleTime: 3000,

    // auto force send cookie auth to server
    // default false
    withCredentials: false,

    // request time out cancel: callback to catch function
    timeout: 0,

    // responseType
    responseType: RESPONSE_TYPE_JSON
}