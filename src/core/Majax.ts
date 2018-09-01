import defaults from '../config/initConfig'
import mergeConfig from "../../utils/mergeConfig";
import {GET_FLAG, POST_FLAG} from "../config/requestMethods";
import MRequest from "./MRequest";
import Queue from "../impelments/Queue";
import MResponse from "./MResponse";
import {RESP_SUCCESS_CODE_PREFIX} from "../config/regexp";

class Majax {
    // `_store`
    // store is the cache pool for every request which match store strategy rule
    private _store: Object

    // `_requestQueue`
    // for request instance ordered processing
    private _requestQueue: Queue

    // `_requestQueue`
    // for response instance ordered processing
    private _responseQueue: Queue

    // `_requestInterceptor`
    // the last chance to custom request config
    // do something specific before request
    private _requestInterceptor: Function

    // `_responseInterceptor`
    // do something specific before request
    private _responseInterceptor: Function

    // `_requestPool`: Reserved field
    // contain all 'SENDING_STATE' request instance
    private _requestPool: Object

    // `_requestDealTarget`
    // this is a request instance who is dealing and only one instance can be deal at the same time
    private _requestDealTarget: MRequest

    // `_responseDealTarget`
    // this is a response instance who is dealing and only one instance can be deal at the same time
    private _responseDealTarget: MResponse

    // `config`
    // global config bind on a majax instance, which will inject into every request instance
    public config: Object

    constructor(opts = {}) {
        this.config = mergeConfig(defaults, opts)
        this._store = {}
        this._requestQueue = new Queue()
        this._responseQueue = new Queue()
        this._requestPool = {}
        this._requestDealTarget = null
    }

    /**
     * @desc entry of request, request enqueue
     * @param requestInstance
     * */
    public _runReq(requestInstance: MRequest) {
        // inject majax driver into request instance
        requestInstance.accept(this)

        this._requestQueue.enqueue(requestInstance)
        this._emitRequestFlow()
    }

    /**
     * @desc check and unqueue request into request pool
     * */
    private _emitRequestFlow() {
        if (!this._requestDealTarget && this._requestQueue.hasNext()) {
            this._requestDealTarget = this._requestQueue.unqueue()
            if (this._requestInterceptor) this._requestInterceptor(this._requestDealTarget.config)
            this._pushToRequestPool(this._requestDealTarget)
        }
    }

    /**
     * @desc entry of response, response enqueue
     * @param responseInstance
     * */
    public _runResp(responseInstance: MResponse) {
        this._responseQueue.enqueue(responseInstance)
        this._emitResponseFlow()

        if (responseInstance.request.withRushStore) {
            this._store[responseInstance.request.url].hasCache = true
            while (this._store[responseInstance.request.url].listeners.length > 0) {
                let req = this._store[responseInstance.request.url].listeners.shift()
                this._runResp(
                    new MResponse(
                        this._store[responseInstance.request.url].xhr,
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
        if (!this._responseDealTarget && this._responseQueue.hasNext()) {
            this._responseDealTarget = this._responseQueue.unqueue()
            if (this._responseInterceptor) this._responseInterceptor(this._responseDealTarget.config)
            this._handleComplete(this._responseDealTarget)
        }
    }

    /**
     * @desc deal with complete response instance and emit callback
     * @param responseInstance
     * */
    private _handleComplete(responseInstance: MResponse) {
        this._responseDealTarget = null
        delete this._requestPool[responseInstance.request.getUUID()]

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
    private _pushToRequestPool(requestInstance: MRequest) {
        this._requestPool[requestInstance.getUUID()] = requestInstance
        this._requestDealTarget = null
        requestInstance.send()

        this._emitRequestFlow()
    }

    /**
     * @desc Determine if the cache policy is matched and determine the form of the request (Ajax or Cache)
     * @param rule
     * @param requestInstance
     * */
    public storeWithRule(rule, requestInstance) {
        const runRespWithStore = () => {
            this._runResp(
                new MResponse(
                    this._store[requestInstance.url].xhr,
                    requestInstance
                )
            )
        }

        if (!this._store[requestInstance.url]) {
            this._store[requestInstance.url] = {
                hasCache: false,
                xhr: requestInstance.initXHR(),
                listeners: [],
                maxAge: rule.maxAge,
                expires: new Date().getTime() + rule.maxAge
            }

            requestInstance.xhr.send(JSON.stringify(requestInstance.data))

            return
        }

        if (requestInstance.withRushStore) {
            requestInstance.sendAjax()
        }

        this._store[requestInstance.url].listeners.push(requestInstance)

        if (this._store[requestInstance.url].hasCache) {
            if (
                this._store[requestInstance.url].maxAge &&
                new Date().getTime() <= this._store[requestInstance.url].expires
            ) {
                runRespWithStore()
            } else {
                runRespWithStore()
            }
        }
    }

    /**
     * @desc check store if match rush strategy
     * @param url
     * */
    public checkStoreExpired(url) {
        if (!this._store[url]) return true
        if (!this._store[url].maxAge) return true

        if (this._store[url].maxAge) {
            return (new Date().getTime() > this._store[url].expires)
        }
    }

    // ---------------------- global api recommended to users ----------------------

    /**
     * @desc interceptor before request send
     * @param interceptor
     * */
    public setRequestInterceptor(interceptor: Function) {
        this._requestInterceptor = interceptor
    }

    /**
     * @desc interceptor after response and before callback emitted
     * @param interceptor
     * */
    public setResponseInterceptor(interceptor: Function) {
        this._responseInterceptor = interceptor
    }

    /**
     * @desc global request api
     * @param opts
     * */
    public request(opts) {
        return new Promise((resolve, reject) => {
            // init request instance & mixin resolve and reject
            // start request flow
            this._runReq(
                new MRequest(mergeConfig(this.config, opts), resolve, reject)
            )
        })
    }

    public get(url, opts = {}) {
        return this.request({
            ...opts,
            url,
            method: GET_FLAG
        })
    }

    public post(url, opts) {
        return this.request({
            ...opts,
            url,
            method: POST_FLAG
        })
    }
}

export default new Majax()