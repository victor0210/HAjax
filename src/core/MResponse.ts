import MRequest from "./MRequest";
import transferResponseData from "../utils/transferResponseData";

export default class MResponse {
    // `data`
    // is an object transformed by response schema data
    public data: any

    // `status`
    // is response status code
    public status: Number

    // `statusText`
    // is the HTTP status message from the server response `statusText` is the HTTP status message from the server respo
    public statusText: String

    // `headers`
    // the headers that the server responded with
    // All header names are lower cased
    public headers: Object

    // `config`
    // is the config that was provided to `majax` for the request
    public config: Object

    // `request`
    // MRequest instance which produce this response
    public request: MRequest

    constructor(completedXhr: XMLHttpRequest, requestInstance: MRequest) {
        this.status = completedXhr.status
        this.statusText = completedXhr.statusText
        this.headers = requestInstance.headers
        this.config = requestInstance.config
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
