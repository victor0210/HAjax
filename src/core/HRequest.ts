import HResponse from "./HResponse";
import {STATE_DONE} from "../config/readyState";
import HAjax from "./HAjax";
import findMatchStrategy from "../utils/findMatchStrategy";
import {GET_FLAG} from "../config/requestMethods";
import urlFormat from "../utils/urlFormat";
import {RESP_SUCCESS_CODE_PREFIX} from "../config/regexp";

class HRequest {
    // `_uuid`
    // "Universally Unique Identifier" for marking per request:
    private _uuid: number = ~~(Math.random() * 10e8)

    // `_onFulfilled`
    // callback with request success
    private _onFulfilled: Function

    // `_onFailed`
    // callback with request failed
    private _onFailed: Function

    // `url`
    // Server URL that will be used for the request
    public url: string

    // `method`
    // request method to be used when making the request
    public method: string

    // `baseURL`
    // will be prepended to `url` unless `url` is absolute such as http://* or https://*.
    // It can be convenient to set `baseURL` for an instance of hajax to pass relative URLs
    // to methods of that instance.
    public baseURL: string

    // `fullURL`
    //  The actual requested url combined by baseURL and url before send out
    public fullURL: string

    // `headers`
    // custom headers to be sent
    public headers: object

    // `params`
    // URL parameters to be sent with the request
    // Must be a plain object or a URLSearchParams object
    public params: object

    // `data`
    // data to be sent as the request body
    // Only applicable for request methods 'POST'
    public data: object

    // `timeout`
    // specifies the number of milliseconds before the request times out.
    // If the request takes longer than `timeout`, the request will be aborted.
    public timeout: number

    // `withCredentials`
    // indicates whether or not cross-site Access-Control requests
    // should be made using credentials
    public withCredentials: boolean

    // `responseType`
    // indicates the type of data that the server will respond with
    // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    public responseType: string // default

    // `xhr`
    // XMLHttpRequest for sending real ajax request
    // is here should be named `driver` contains [fetch, XMLHttpRequest, ActiveXObject] and
    // provide a facade for those drivers is recommended to be considered
    public xhr: XMLHttpRequest

    // `config`
    // is what pass through the whole request flow
    public config: Config

    // `withRushStore`
    // will restore cache data if necessary
    public withRushStore: boolean

    // `hajaxInstance`
    // driver of this request, inject by visit
    public hajaxInstance: HAjax

    // `aborted`
    // abort flag for concurrent requests buffer area
    public aborted: boolean

    // `retryLimit`
    // resend another request if has a bad response
    public retryLimit: number

    // `retryBuffer`
    // interval of retry request
    public retryBuffer: number

    // `mode`
    // more confidence to make request 'debounce' or 'throttle'
    public mode: string

    // `debounceTime`
    public debounceTime: number

    // `throttleTime`
    public throttleTime: number

    constructor(config) {
        this.url = config.url
        this.method = config.method
        this.baseURL = config.baseURL
        this.headers = config.headers
        this.params = config.params
        this.mode = config.mode
        this.retryLimit = config.retryLimit
        this.retryBuffer = config.retryBuffer
        this.debounceTime = config.debounceTime
        this.throttleTime = config.throttleTime
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
    public success(responseInstance: HResponse) {
        this._onFulfilled && this._onFulfilled(responseInstance)
    }

    /**
     * @desc emit failed handler running
     * @param responseInstance
     * */
    public failed(responseInstance: HResponse) {
        this._onFailed && this._onFailed(responseInstance)
    }

    /**
     * @desc collect fulfilled handler
     * @param onFulfilled
     * */
    public then(onFulfilled: Function) {
        // will support multiple fulfilled handlers
        this._onFulfilled = onFulfilled
        return this
    }

    /**
     * @desc collect failed handler
     * @param onFailed
     * */
    public catch(onFailed: Function) {
        this._onFailed = onFailed
        return this
    }

    /**
     * @desc abort the request to be sent and being sent
     *
     * what kind of request would be aborted is not in concurrentBuffer
     * and isn`t an cache request-leader, which is the request will emit
     * callbacks in concurrentBuffer after response
     * */
    public abort() {

        this.aborted = true

        if (this.xhr) {
            const store = this.hajaxInstance.store[this.url]

            // abort directly if request is single action
            if (
                !store ||
                (store && store.concurrentBuffer.length === 0)
            ) this.xhr.abort()
        }

        // add abort callback ?
    }

    /**
     * @desc got uuid of request instance
     * @return _uuid
     * */
    public getUUID(): number {
        return this._uuid
    }

    /**
     * @desc accept hajax instance for visiting
     * @param hajaxInstance
     * */
    public accept(hajaxInstance: HAjax) {
        this.hajaxInstance = hajaxInstance
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

        this.fullURL = urlFormat(this.config.baseURL, this.config.url, this.config.params)

        // only request with get method could be cached
        // it might be put or others later
        if (this.method.toLowerCase() === GET_FLAG && this.hajaxInstance.storeStrategy) {
            const urlKey = this.fullURL
            let rule = findMatchStrategy(this.hajaxInstance.storeStrategy, urlKey)

            if (rule) {
                this.withRushStore = this.hajaxInstance.checkStoreExpired(urlKey)
                this.hajaxInstance.storeWithRule(rule, this)
            } else {
                this.sendAjax()
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
            this.fullURL
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
                // bad request do retry
                if (
                    !RESP_SUCCESS_CODE_PREFIX.test(xhr.status.toString()) &&
                    this.retryLimit > 0
                ) {
                    setTimeout(() => {
                        this.sendAjax()
                        this.retryLimit--

                        // if xhr has already in 'hajax' store, just cover it with new xhr
                        if (this.hajaxInstance.store[this.fullURL] &&
                            this.hajaxInstance.store[this.fullURL].xhr === xhr
                        ) this.hajaxInstance.store[this.fullURL].xhr = this.xhr
                    }, this.retryBuffer)
                } else {
                    // Get the raw header string
                    let headers = xhr.getAllResponseHeaders();

                    // Convert the header string into an array
                    // of individual headers
                    let arr = headers.trim().split(/[\r\n]+/)

                    // Create a map of header names to values
                    let headerMap = {};
                    arr.forEach((line) => {
                        let parts = line.split(': ')
                        let header = parts.shift()
                        headerMap[header] = parts.join(': ')
                    });

                    this.hajaxInstance._runResp(
                        new HResponse(
                            xhr,
                            this,
                            headerMap
                        )
                    )
                }
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

export default HRequest