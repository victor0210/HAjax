import defaults from '../config/initConfig'
import mergeConfig from "../utils/mergeConfig";
import {GET_FLAG, POST_FLAG} from "../config/requestMethods";
import HRequest from "./HRequest";
import Queue from "../impelments/Queue";
import HResponse from "./HResponse";
import {CACHE_FOREVER, RESP_SUCCESS_CODE_PREFIX} from "../config/regexp";
import {containedInArr, matchInstance, matchType} from "../utils/matcher";
import {throwIf, warnIf} from "../utils/conditionCheck";
import {DEBOUNCE, THROTTLE} from "../config/storeMode";
import {TYPE_OBJECT} from "../config/baseType";
import Strategy from "./Strategy";

class HAjax {
    // `_requestDealTarget`
    // this is a request instance who is dealing and only one instance can be deal at the same time
    private _requestDealTarget: HRequest

    // `_responseDealTarget`
    // this is a response instance who is dealing and only one instance can be deal at the same time
    private _responseDealTarget: HResponse

    // `store`
    // store is the cache pool for every request which match store strategy rule
    // The data model is as follows:
    // {
    //   test.demo.com: {                                   // key is must be the cache full url (with params)
    //     hasCache: boolean,                               // if has cache data here
    //     xhr: XMLHttpRequest,                             // Cached Data, which is a XMLHttpRequest instance
    //     concurrentBuffer: [RequestInstance, ...],        // Buffer Area for concurrent requests
    //     bufferTime: 3000(ms),                            // Buffer duration
    //     expires: new Date().getTime() + rule.bufferTime  // cache or buffer expire time
    //   }
    //   ...
    // }
    public store: object

    // `throttleStore`
    // cache center for throttle requests
    public throttleStore: object

    // `debounceStore`
    // cache center for debounce requests
    public debounceStore: object

    // `requestQueue`
    // for request instance ordered processing
    public requestQueue: Queue

    // `responseQueue`
    // for response instance ordered processing
    public responseQueue: Queue

    // `requestInterceptor`
    // the last chance to custom request config
    // do something specific before request
    public requestInterceptor: Function

    // `responseInterceptor`
    // do something specific before request
    public responseInterceptor: Function

    // `requestPool`: Reserved field
    // contain all 'SENDING_STATE' request instance
    public requestPool: object

    // `storeStrategy`
    // majax cache strategy, valid key can be "url", "bufferTime"
    // store strategy is very special because it has Multiple-Request optimization such as 'debounce' and 'throttle'
    // you don't worry the blow requests sending to server without the first request complete
    // they will be pushed to cache listener and waiting for the first request complete
    public storeStrategy: any

    // `config`
    // global config bind on a majax instance, which will inject into every request instance
    public config: object

    constructor(opts = {}) {
        this.config = mergeConfig(defaults, opts)
        this.store = {}
        this.requestQueue = new Queue()
        this.responseQueue = new Queue()
        this.requestPool = {}
        this.debounceStore = {}
        this.throttleStore = {}
        this.storeStrategy = null
        this._requestDealTarget = null
    }

    /**
     * @desc entry of request, request enqueue
     * @param requestInstance
     * */
    public _runReq(requestInstance: HRequest) {
        const requestAction = () => {
            // inject majax driver into request instance and start real request flow
            requestInstance.accept(this)

            this.requestQueue.enqueue(requestInstance)
            this._emitRequestFlow()
        }

        const {mode, url, debounceTime, throttleTime} = requestInstance

        // request with three type of ways: normal, debounce, throttle
        switch (mode) {
            case DEBOUNCE:
                if (!this.debounceStore[url])
                    this.debounceStore[url] = {
                        timer: null
                    }

                const debounce = this.debounceStore[url]

                if (debounce.timer) clearTimeout(debounce.timer)

                debounce.timer = setTimeout(() => {
                    requestAction()
                    clearTimeout(debounce.timer)
                }, debounceTime)
                break
            case THROTTLE:
                if (!this.throttleStore[url])
                    this.throttleStore[url] = {
                        ban: false
                    }

                const throttle = this.throttleStore[url]

                if (!throttle.ban) {
                    throttle.ban = true
                    setTimeout(() => {
                        throttle.ban = false
                    }, throttleTime)
                    requestAction()
                }
                break
            default:
                requestAction()
        }
    }

    /**
     * @desc check and unqueue request into request pool
     * */
    private _emitRequestFlow() {
        if (!this._requestDealTarget && this.requestQueue.hasItem()) {
            this._requestDealTarget = this.requestQueue.unqueue()
            if (this.requestInterceptor) this.requestInterceptor(this._requestDealTarget.config)
            this._pushToRequestPool(this._requestDealTarget)
        }
    }

    /**
     * @desc entry of response, response enqueue
     * @param responseInstance
     * */
    public _runResp(responseInstance: HResponse) {
        if (!responseInstance.request.aborted) {
            this.responseQueue.enqueue(responseInstance)
            this._emitResponseFlow()
        }

        const urlKey = responseInstance.request.fullUrl

        if (
            responseInstance.request.withRushStore &&
            responseInstance.request.xhr === this.store[urlKey].xhr
        ) {
            const cache = this.store[urlKey]

            cache.hasCache = true
            while (cache.concurrentBuffer.length > 0) {
                let req = cache.concurrentBuffer.shift()

                !req.aborted && this._runResp(
                    new HResponse(
                        cache.xhr,
                        req
                    )
                )
            }
        }
    }

    /**
     * @desc check and unqueue response into request pool
     * */
    private _emitResponseFlow() {
        if (!this._responseDealTarget && this.responseQueue.hasItem()) {
            this._responseDealTarget = this.responseQueue.unqueue()
            if (this.responseInterceptor) this.responseInterceptor(this._responseDealTarget.config)
            this._handleComplete(this._responseDealTarget)
        }
    }

    /**
     * @desc deal with complete response instance and emit callback
     * @param responseInstance
     * */
    private _handleComplete(responseInstance: HResponse) {
        this._responseDealTarget = null
        delete this.requestPool[responseInstance.request.getUUID()]

        this._emitResponseFlow()

        if (RESP_SUCCESS_CODE_PREFIX.test(responseInstance.status.toString())) {
            responseInstance.completeWithFulfilled()
        } else {
            responseInstance.completeWithFailed()
        }
    }

    /**
     * Reserved field
     * @desc just a collection of request which on sending
     * @param requestInstance
     * */
    private _pushToRequestPool(requestInstance: HRequest) {
        this.requestPool[requestInstance.getUUID()] = requestInstance
        this._requestDealTarget = null
        requestInstance.send()

        this._emitRequestFlow()
    }

    /**
     * @desc Determine if the cache policy is matched and determine the form of the request (Ajax or Cache)
     * @param rule
     * @param requestInstance
     * */
    public storeWithRule(rule, requestInstance: HRequest) {
        let cache = this.store[requestInstance.fullUrl]

        const runRespWithStore = () => {
            this._runResp(
                new HResponse(
                    cache.xhr,
                    requestInstance
                )
            )
        }

        // Turn on an actual request if there is no cache or the request needs to flush the cache
        // If the first request is being requested and the cache time exceeds expires at this time
        // the next request will overwrite the data being cached at this time and the new data
        // will be used to trigger the callback handler of the request instance in concurrentBuffer
        // which may be Producing bugs what is the callback in concurrentBuffer action delay or not work
        // strategies for this extreme situation remain to be considered
        // When you encounter this situation, you can set the bufferTime longer
        // or disable store strategy for the trouble url

        if (!cache || requestInstance.withRushStore) return this.rushRequest(rule, requestInstance)

        cache.concurrentBuffer.push(requestInstance)

        if (cache.hasCache) {
            if (cache.bufferTime && cache.bufferTime !== CACHE_FOREVER) {
                if (new Date().getTime() <= cache.expires) runRespWithStore()
            } else {
                runRespWithStore()
            }
        }
    }

    public rushRequest(rule, requestInstance: HRequest) {
        requestInstance.sendAjax()

        this.rushStore(
            requestInstance.fullUrl,
            requestInstance.xhr,
            rule.bufferTime
        )
    }

    /**
     * @desc check store if match rush strategy
     * @param url
     * */
    public checkStoreExpired(url: string): boolean {
        if (!this.store[url]) return true
        if (!this.store[url].bufferTime) return true

        if (this.store[url].bufferTime) {
            return (
                new Date().getTime() > this.store[url].expires &&
                this.store[url].bufferTime !== CACHE_FOREVER
            )
        }
    }

    /**
     * @desc init or rush old store
     * @param key: request fullpath
     * @param xhr
     * @param bufferTime
     * */
    public rushStore(key: string, xhr: XMLHttpRequest, bufferTime: number) {
        if (!this.store[key]) {
            this.store[key] = {
                hasCache: false,
                xhr: xhr,
                concurrentBuffer: [],
                bufferTime: bufferTime,
                expires: new Date().getTime() + bufferTime
            }
        } else {
            this.store[key] = {
                ...this.store[key],
                xhr: xhr,
                expires: new Date().getTime() + bufferTime
                // bufferTime: bufferTime,          // if need rush bufferTime for user update ?
            }
        }
    }

    // ---------------------- global api recommended to users ----------------------

    /**
     * @desc interceptor before request send
     * @param interceptor
     * */
    public setRequestInterceptor(interceptor: Function) {
        this.requestInterceptor = interceptor
    }

    /**
     * @desc interceptor after response and before callback emitted
     * @param interceptor
     * */
    public setResponseInterceptor(interceptor: Function) {
        this.responseInterceptor = interceptor
    }

    /**
     * @desc global request api
     * @param opts
     * */
    public request(opts: object): HRequest {
        // check if match debounce or throttle strategies
        throwIf(
            !matchType(opts, TYPE_OBJECT),
            `request options type except to be [${TYPE_OBJECT}] but got [${typeof opts}]`
        )

        const options = mergeConfig(this.config, opts)

        // validate request mode and fix
        const {mode} = options

        if (mode) {
            const modeIsValid = containedInArr(mode, [DEBOUNCE, THROTTLE])

            warnIf(
                !modeIsValid,
                `mode [${mode}"] is invalid, it support to be "${DEBOUNCE}" or "${THROTTLE}"`
            )

            if (!modeIsValid) delete options.mode
        }

        const request = new HRequest(options)

        setTimeout(() => {
            this._runReq(request)
        })

        return request
    }

    public get(url: string, opts = {}): HRequest {
        return this.request({
            ...opts,
            url,
            method: GET_FLAG
        })
    }

    public post(url: string, opts = {}): HRequest {
        return this.request({
            ...opts,
            url,
            method: POST_FLAG
        })
    }

    /**
     * @desc facade for promise.all
     * @param promises: Array<Promise>
     * */
    public all(promises: Array<any>) {
        return Promise.all(promises)
    }

    /**
     * @desc facade for promise.race
     * @param promises: Array<Promise>
     * */
    public race(promises: Array<any>) {
        return Promise.race(promises)
    }

    /**
     * @desc validate strategy param if valid
     * @param urlExp
     * @param bufferTime: the cache would be force used if bufferTime is -1 (default)
     * */
    public createStrategy(urlExp: any, bufferTime: number = CACHE_FOREVER): Strategy {
        return new Strategy(urlExp, bufferTime)
    }

    /**
     * @desc set new store strategy for driver, which could cover the old strategy
     * @param strategy
     * */
    public setStrategy(strategy: any) {
        this.storeStrategy = strategy
    }

    /**
     * @desc clear data in store by hand
     * @param exp: valid value is "string", "Regexp", "*"
     * */
    public clearStore(exp?) {
        if (!exp) {
            // callbacks would not work if clear with follow
            // strategies for concurrentBuffer when clear action is remain to be considered
            this.storeStrategy = null
        } else {
            if (Array.isArray(this.storeStrategy)) {
                this.storeStrategy = this.storeStrategy.filter(strategy => {
                    return strategy.urlExp !== exp
                })
            } else if (this.storeStrategy.urlExp === exp) {
                this.storeStrategy = null
            }
        }
    }
}

export default HAjax