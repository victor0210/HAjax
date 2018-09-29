import {warnIf} from "../utils/conditionCheck";

class Strategy {
    // `url`
    // can be a server url, regexp or just '*'
    public urlExp: String | RegExp

    // `bufferTime`
    // request would be pushed to the concurrentBuffer if same with before
    // and strategy is not expired
    // every request in concurrentBuffer will receive the first response
    // and throw it for completed-handler
    public bufferTime: Number

    constructor(urlExp: String | RegExp, bufferTime: Number) {
        warnIf(
            !urlExp,
            'url in store strategy is invalid'
        )

        this.urlExp = urlExp
        this.bufferTime = ~~bufferTime
    }
}

export default Strategy