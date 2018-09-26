import MRequest from "./MRequest";
import transferResponseData from "../../utils/transferResponseData";

export default class MResponse {

    // `data` is an object transformed by response schema data
    data: any

    // `status` is response status code
    status: Number

    // `statusText` is the HTTP status message from the server response `statusText` is the HTTP status message from the server respo
    statusText: String

    // `headers` the headers that the server responded with
    // All header names are lower cased
    headers: Object

    // `config` is the config that was provided to `majax` for the request
    config: Object

    // `request` is Request instance
    request: MRequest

    constructor (
        completedXhr,
        requestInstance
    ) {
        this.status = completedXhr.status
        this.statusText = completedXhr.statusText
        this.headers = requestInstance.headers
        this.config = requestInstance.config
        this.data = transferResponseData(completedXhr)
        this.request = requestInstance
    }

    public completeWithFulfilled() {
        this.request.success(this)
    }

    public completeWithFailed() {
        this.request.failed(this)
    }
}