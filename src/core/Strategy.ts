import {warnIf} from "../utils/conditionCheck";
import {CACHE_FOREVER} from "../config/regexp";

class Strategy {
    // `url`
    // can be a server url, regexp or just '*'
    public urlExp: any

    // `bufferTime`
    // request would be pushed to the concurrentBuffer if same with before
    // and strategy is not expired
    // every request in concurrentBuffer will receive the first response
    // and throw it for completed-handler
    public bufferTime: number

    // `autoRetry`
    // lead request will autoRetry when complete error, and times plus one when
    // another request pushed into concurrent buffer
    public autoRetry: boolean

    constructor(urlExp: any, bufferTime: number, autoRetry: boolean) {
        warnIf(
            !urlExp,
            'url in store strategy is invalid'
        )

        this.urlExp = urlExp
        this.bufferTime = ~~bufferTime || CACHE_FOREVER
        this.autoRetry = !!autoRetry
    }
}

export default Strategy