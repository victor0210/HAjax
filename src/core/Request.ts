import createXHR from '../../utils/createXHR'

export default class Request {
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
    _xhr: XMLHttpRequest

    // `_resovler`
    _resolver: Function

    // `_rejecter`
    _rejecter: Function

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

        this._resolver = config.resolver
        this._rejecter = config.rejecter
        this._initXHR()
    }

    private _initXHR() {
        // xhr in browser
        this._xhr = createXHR(this)
    }

    send() {
        this._xhr.send(JSON.stringify(this.data))
    }
}
