export default class Request {
    config: any
    private _xhr: any

    constructor(config) {
        this.config = config
    }

    setXHR(xhr) {
        this._xhr = createXHR(this.config)
    }

    send() {
        this._xhr.send()
    }
}
