import _defaults from 'config/initConfig'
import mergeConfig from "../../utils/mergeConfig";
import {GET_FLAG, POST_FLAG} from "../config/requestMethods";
import MRequest from "./MRequest";

class Majax {
    private _store
    private _requestQueue
    private _responseQueue
    private _requestInterceptor
    private _responseInterceptor
    private _requestPool
    private _requestDealTarget
    private _responseDealTarget

    public config

    constructor(opts) {
        this.config = mergeConfig(_defaults, opts)
        this._store = {}
        this._requestQueue = new Queue()
        this._responseQueue = new Queue()
        this._requestDealTarget = null
    }

    public runReq(requestInstance) {
        requestInstance.accept(requestInstance)
        this._requestQueue.enqeueue(requestInstance)
        this._emitRequestFlow()
    }

    private _emitRequestFlow() {
        if (!this._requestDealTarget && this._requestQueue.hasNext()) {
            this._requestDealTarget = this._requestQueue.unqueue()
            if (this._requestInterceptor) this._requestDealTarget = this._requestInterceptor(this._requestDealTarget)
            this._pushToRequestPool(this._requestDealTarget)
        }
    }

    public runResp(responseInstance) {
        // responseInstance.accept(responseInstance)
        this._responseQueue.enqeueue(responseInstance)
        this._emitResponseFlow()
    }

    private _emitResponseFlow() {
        if (!this._responseDealTarget && this._responseQueue.hasNext()) {
            this._responseDealTarget = this._responseQueue.unqueue()
            if (this._responseInterceptor) this._responseDealTarget = this._responseInterceptor(this._responseDealTarget)
            this._handleComplete(this._responseDealTarget)
        }
    }

    private _handleComplete(responseInstance) {
        if (/^[2]/.test(responseInstance.code)) {
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

    public setRequestInterceptor(interceptor) {
        this._requestInterceptor = interceptor
    }

    public setResponseInterceptor(interceptor) {
        this._responseInterceptor = interceptor
    }

    /**
     * 1. return promise
     * 2. return request instance (idea)
     * */
    public request(opts) {
        return new Promise((resolve, reject) => {
            // init request instance & mixin resolve and reject
            // start request flow
            this.runReq(
                new MRequest(opts, resolve, reject)
            )
        })
    }

    public get(opts) {
        return this.request({
            ...opts,
            methods: GET_FLAG
        })
    }

    public post(opts) {
        return this.request({
            ...opts,
            methods: POST_FLAG
        })
    }
}