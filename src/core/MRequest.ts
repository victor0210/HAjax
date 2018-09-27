import createXHR from '../../utils/createXHR'
import MResponse from "./MResponse";
import {STATE_DONE} from "../config/readyState";
import Majax from "./Majax";
import findMatchStrategy from "../../utils/findMatchStrategy";
import {GET_FLAG} from "../config/requestMethods";

export default class MRequest {
    private _uuid: Number = ~~(Math.random() * 10e8)
    // `url` is the server URL that will be used for the request
    url: String

    // `method` is the request method to be used when making the request
    method: String

    // `baseURL` will be prepended to `url` unless `url` is absolute.
    // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
    // to methods of that instance.
    baseURL: String

    // `headers` are custom headers to be sent
    headers: Object

    // `params` are the URL parameters to be sent with the request
    // Must be a plain object or a URLSearchParams object
    params: Object

    // `data` is the data to be sent as the request body
    // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
    // When no `transformRequest` is set, must be of one of the following types:
    // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
    // - Browser only: FormData, File, Blob
    // - Node only: Stream, Buffer
    data: Object

    // `timeout` specifies the number of milliseconds before the request times out.
    // If the request takes longer than `timeout`, the request will be aborted.
    timeout: Number

    // `withCredentials` indicates whether or not cross-site Access-Control requests
    // should be made using credentials
    withCredentials: Boolean

    // `responseType` indicates the type of data that the server will respond with
    // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    responseType: String // default

    // `_xhr` is ajax request driver
    xhr: XMLHttpRequest

    // `config` is what pass through the whole request flow
    config: any

    // `withRushStore` will restore cache data if necessary
    withRushStore: Boolean

    // `_majaxInstance` driver of this request, inject by visit
    _majaxInstance: Majax

    // `_onFulfilled`
    _onFulfilled: Function

    // `_onFailed`
    _onFailed: Function

    constructor (
        config,
        onFulfilled,
        onFailed
    ) {
        this.url = config.url
        this.method = config.method
        this.baseURL= config.baseURL
        this.headers= config.headers
        this.params= config.params
        this.data= config.data
        this.timeout= config.timeout
        this.withCredentials= config.withCredentials
        this.responseType = config.responseType
        this.config = config
        this.withRushStore = false
        this._onFulfilled = onFulfilled
        this._onFailed = onFailed
    }

    private initXHR() {
        // xhr in browser
        const xhr = createXHR(this)

        xhr.onreadystatechange = () => {
            if (xhr.readyState == STATE_DONE){
                this._majaxInstance._runResp(
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

    public success(responseInstance) {
        this._onFulfilled(responseInstance)
    }

    public failed(responseInstance) {
        this._onFailed(responseInstance)
    }

    public getUUID () {
        return this._uuid
    }

    public accept (majaxInstance) {
        this._majaxInstance = majaxInstance
    }

    /**
     * @description
     * 1. check if has store strategy           | do request if not
     * 2. check if match store strategy         | do request if not
     * 3. check if has cache and not expire     | do request if not
     * 4. catch data from cache and response
     * */
    public send() {
        if (this.method.toLowerCase() === GET_FLAG && this.config.storeStrategy) {
            let rule = findMatchStrategy(this.config.storeStrategy, this.url)

            if (rule) {
                this.withRushStore = this._majaxInstance.checkStoreExpired(this.url)
                console.log(this.withRushStore, 'withRushStore', new Date().getTime())
                this._majaxInstance.storeWithRule(rule, this)
            }
        } else {
            this.sendAjax()
        }
    }

    public sendAjax() {
        this.initXHR()
        this.xhr.send(JSON.stringify(this.data))
    }
}
