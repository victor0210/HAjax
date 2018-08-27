import createXHR from '../../utils/createXHR'
import MResponse from "./MResponse";
import Majax from "./Majax";
import {STATE_DONE} from "../config/readyState";

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
    config: Object

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
        this.config = config
        this._onFulfilled = onFulfilled
        this._onFailed = onFailed
    }

    private _initXHR() {
        // xhr in browser
        const xhr = createXHR(this)

        xhr.onreadystatechange = () => {
            if (xhr.readyState == STATE_DONE){
                console.log(xhr)
                this._majaxInstance._runResp(
                    new MResponse(
                        xhr,
                        this
                    )
                )
            }
        }

        this.xhr = xhr
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

    public send() {
        this._initXHR()

        this.xhr.send(JSON.stringify(this.data))
    }
}
