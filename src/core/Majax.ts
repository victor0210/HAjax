import defaults from '../config/initConfig'
import mergeConfig from "../../utils/mergeConfig";
import {GET_FLAG, POST_FLAG} from "../config/requestMethods";
import MRequest from "./MRequest";
import Queue from "../impelments/Queue";
import MResponse from "./MResponse";
import {RESP_SUCCESS_CODE_PREFIX} from "../config/regexp";

class Majax {
    private _store: Object

    private _requestQueue: Queue

    private _responseQueue: Queue

    private _requestInterceptor: Function

    private _responseInterceptor: Function

    private _requestPool: {}

    private _requestDealTarget: MRequest

    private _responseDealTarget: MResponse

    public config: Object

    constructor (
        opts = {}
    ) {
        this.config = mergeConfig(defaults, opts)
        this._store = {}
        this._requestQueue = new Queue()
        this._responseQueue = new Queue()
        this._requestPool = {}
        this._requestDealTarget = null
    }

    public _runReq(requestInstance) {
        requestInstance.accept(this)
        this._requestQueue.enqueue(requestInstance)
        this._emitRequestFlow()
    }

    private _emitRequestFlow() {
        if (!this._requestDealTarget && this._requestQueue.hasNext()) {
            this._requestDealTarget = this._requestQueue.unqueue()
            if (this._requestInterceptor) this._requestInterceptor(this._requestDealTarget.config)
            this._pushToRequestPool(this._requestDealTarget)
        }
    }

    public _runResp(responseInstance) {
        this._responseQueue.enqueue(responseInstance)
        this._emitResponseFlow()
    }

    private _emitResponseFlow() {
        if (!this._responseDealTarget && this._responseQueue.hasNext()) {
            this._responseDealTarget = this._responseQueue.unqueue()
            if (this._responseInterceptor) this._responseInterceptor(this._responseDealTarget.config)
            this._handleComplete(this._responseDealTarget)
        }
    }

    private _handleComplete(responseInstance) {
        this._responseDealTarget = null
        delete this._requestPool[responseInstance.request.getUUID()]

        this._emitResponseFlow()

        if (RESP_SUCCESS_CODE_PREFIX.test(responseInstance.status)) {
            responseInstance.completeWithFulfilled()
        } else {
            responseInstance.completeWithFailed()
        }
    }

    private _pushToRequestPool(requestInstance) {
        this._requestPool[requestInstance.getUUID()] = requestInstance
        this._requestDealTarget = null
        this._emitRequestFlow()

        requestInstance.send()
    }

    /**
     * @description global api for request, config
     * */

    public setRequestInterceptor(interceptor) {
        this._requestInterceptor = interceptor
    }

    public setResponseInterceptor(interceptor) {
        this._responseInterceptor = interceptor
    }

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