import MResponse from "./MResponse";
import {STATE_DONE} from "../config/readyState";
import Majax from "./Majax";
import findMatchStrategy from "../utils/findMatchStrategy";
import {GET_FLAG} from "../config/requestMethods";
import urlFormat from "../utils/urlFormat";

export default class MRequest {
    // `_uuid`
    // "Universally Unique Identifier" for marking per request:
    private _uuid: Number = ~~(Math.random() * 10e8)

    // `url`
    // Server URL that will be used for the request
    url: String

    // `method`
    // request method to be used when making the request
    method: String

    // `baseURL`
    // will be prepended to `url` unless `url` is absolute such as http://* or https://*.
    // It can be convenient to set `baseURL` for an instance of majax to pass relative URLs
    // to methods of that instance.
    baseURL: String

    // `headers`
    // custom headers to be sent
    headers: Object

    // `params`
    // URL parameters to be sent with the request
    // Must be a plain object or a URLSearchParams object
    params: Object

    // `data`
    // data to be sent as the request body
    // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
    // When no `transformRequest` is set, must be of one of the following types:
    // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
    // - Browser only: FormData, File, Blob
    // - Node only: Stream, Buffer
    data: Object

    // `timeout`
    // specifies the number of milliseconds before the request times out.
    // If the request takes longer than `timeout`, the request will be aborted.
    timeout: Number

    // `withCredentials`
    // indicates whether or not cross-site Access-Control requests
    // should be made using credentials
    withCredentials: Boolean

    // `responseType`
    // indicates the type of data that the server will respond with
    // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    responseType: String // default

    // `_xhr`
    // XMLHttpRequest for sending real ajax request
    xhr: XMLHttpRequest

    // `config`
    // is what pass through the whole request flow
    config: Object

    // `withRushStore`
    // will restore cache data if necessary
    withRushStore: Boolean

    // `majaxInstance`
    // driver of this request, inject by visit
    majaxInstance: Majax

    // `_onFulfilled`
    // callback with request success
    _onFulfilled: Function

    // `_onFailed`
    // callback with request failed
    _onFailed: Function

    constructor(config, onFulfilled, onFailed) {
        this.url = config.url
        this.method = config.method
        this.baseURL = config.baseURL
        this.headers = config.headers
        this.params = config.params
        this.data = config.data
        this.timeout = config.timeout
        this.withCredentials = config.withCredentials
        this.responseType = config.responseType
        this.config = config
        this.withRushStore = false
        this._onFulfilled = onFulfilled
        this._onFailed = onFailed
    }

    /**
     * @desc emit success handler running
     * @param responseInstance
     * */
    public success(responseInstance) {
        this._onFulfilled(responseInstance)
    }

    /**
     * @desc emit failed handler running
     * @param responseInstance
     * */
    public failed(responseInstance) {
        this._onFailed(responseInstance)
    }

    /**
     * @desc got uuid of request instance
     * @return _uuid
     * */
    public getUUID() {
        return this._uuid
    }

    /**
     * @desc accept majax instance for visiting
     * @param majaxInstance
     * */
    public accept(majaxInstance: Majax) {
        this.majaxInstance = majaxInstance
    }

    /**
     * @desc prepare to send an ajax request with blow:
     * 1. check if has store strategy           | do request if not
     * 2. check if match store strategy         | do request if not
     * 3. check if has cache and not expire     | do request if not
     * 4. catch data from cache and response
     * */
    public send() {
        if (this.method.toLowerCase() === GET_FLAG && this.majaxInstance.storeStrategy) {
            let rule = findMatchStrategy(this.majaxInstance.storeStrategy, this.url)

            if (rule) {
                this.withRushStore = this.majaxInstance.checkStoreExpired(this.url)
                this.majaxInstance.storeWithRule(rule, this)
            }
        } else {
            this.sendAjax()
        }
    }

    /**
     * @desc XMLHttpRequest initial: use fetch?
     * */
    public initXHR() {
        const xhr = new XMLHttpRequest();

        xhr.open(
            this.config.method.toUpperCase(),
            urlFormat(this.config.baseUrl, this.config.url, this.config.params)
        )

        //headers
        for (let header in this.config.headers) {
            xhr.setRequestHeader(header, this.config.headers[header]);
        }

        //timeout
        xhr.timeout = this.config.timeout

        //responseType
        xhr.responseType = this.config.responseType

        //withCredentials
        xhr.withCredentials = this.config.withCredentials

        //handle request complete async
        xhr.onreadystatechange = () => {
            if (xhr.readyState == STATE_DONE) {
                this.majaxInstance._runResp(
                    new MResponse(
                        xhr,
                        this
                    )
                )
            }
        }

        this.xhr = xhr

        return xhr
    }

    /**
     * @desc ajax real action
     * */
    public sendAjax() {
        this.initXHR()
        this.xhr.send(JSON.stringify(this.data))
    }
}
