import HRequest from "./HRequest";
import transferResponseData from "../utils/transferResponseData";

export default class HResponse {
    // `data`
    // is an object transformed by response schema data
    public data: any

    // `status`
    // is response status code
    public status: number

    // `statusText`
    // is the HTTP status message from the server response `statusText` is the HTTP status message from the server respo
    public statusText: string

    // `headers`
    // the headers that the server responded with
    // All header names are lower cased
    public headers: object

    // `config`
    // is the config that was provided to `hajax` for the request
    public config: object

    // `request`
    // HRequest instance which produce this response
    public request: HRequest

    constructor(completedXhr: XMLHttpRequest, requestInstance: HRequest, responseHeader: object) {
        this.status = completedXhr.status
        this.statusText = completedXhr.statusText
        this.headers = responseHeader
        this.config = {...requestInstance.config}
        this.data = transferResponseData(completedXhr)
        this.request = requestInstance
    }

    /**
     * @desc start of success callback
     * */
    public completeWithFulfilled() {
        this.request.success(this)
    }

    /**
     * @desc start of failed callback
     * */
    public completeWithFailed() {
        this.request.failed(this)
    }
}
