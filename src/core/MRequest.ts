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

    // `fullUrl`
    //  The actual requested url combined by baseUrl and url before send out
    fullUrl: String

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

    // `aborted`
    // abort flag for concurrent requests buffer area
    aborted: Boolean

    // `_onFulfilled`
    // callback with request success
    _onFulfilled: Function

    // `_onFailed`
    // callback with request failed
    _onFailed: Function

    constructor(config) {
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

    public then(onFulfilled) {
        // will support multiple fulfilled handlers
        this._onFulfilled = onFulfilled
        return this
    }

    public catch(onFailed) {
        this._onFailed = onFailed
        return this
    }

    public abort() {
        // for request in concurrentBuffer
        this.aborted = true

        if (this.xhr) {
            const store = this.majaxInstance.store[this.url]

            // abort directly if request is single action
            if (
                !store ||
                (store && store.concurrentBuffer.length === 0)
            ) this.xhr.abort()
        }
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
        // abort before send
        if (this.aborted) return

        this.fullUrl = urlFormat(this.config.baseUrl, this.config.url, this.config.params)

        // only request with get method could be cached
        // it might be put or others later
        if (this.method.toLowerCase() === GET_FLAG && this.majaxInstance.storeStrategy) {
            const urlKey = this.fullUrl
            let rule = findMatchStrategy(this.majaxInstance.storeStrategy, urlKey)

            if (rule) {
                this.withRushStore = this.majaxInstance.checkStoreExpired(urlKey)
                this.majaxInstance.storeWithRule(rule, this)
            }
        } else {
            this.sendAjax()
        }
    }

    /**
     * @desc XMLHttpRequest initial: use fetch?
     * @attention If you add other ajax drivers(fetch or ActiveXObject) later, you need to provide a facade here.
     * */
    public initXHR() {
        /*
        * // facade like blow:
        * const xhr = new XMLHttpRequest(); ======> const driver = initAjaxDriver(config) // do init with config
        * this.xhr = xhr ======> this.driver = driver
        * */
        const xhr = new XMLHttpRequest();

        xhr.open(
            this.config.method.toUpperCase(),
            this.fullUrl
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
     * @attention If you add other ajax drivers(fetch or ActiveXObject) later, you need to provide a facade here.
     * */
    public sendAjax() {
        this.initXHR()
        this.xhr.send(JSON.stringify(this.data))
    }
}
