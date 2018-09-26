import {RESPONSE_TYPE_JSON} from "./responseTypes";

export default {
    // url prefix
    baseUrl: null,

    // request headers
    headers: {
        'Content-Type': 'application/json'
    },

    // auto force send cookie auth to server
    // default false
    withCredentials: false,

    // request time out cancel: callback to catch function
    timeout: 0,

    // responseType
    responseType: RESPONSE_TYPE_JSON,

    // storeStrategy
    storeStrategy: null
}