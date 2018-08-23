import Request from './Request'

export default class Response {

    // `data` is an object transformed by response schema data
    data: object

    // `status` is response status code
    status: Number

    // `statusText` is the HTTP status message from the server response `statusText` is the HTTP status message from the server respo
    statusText: 'OK'

    // `headers` the headers that the server responded with
    // All header names are lower cased
    headers: {}

    // `config` is the config that was provided to `axios` for the request
    config: {}

    // `request` is Request instance
    request: Request

    constructor(config) {
    }
}
