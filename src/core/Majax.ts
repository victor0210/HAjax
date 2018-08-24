import _defaults from 'config/initConfig'
import mergeConfig from "../../utils/mergeConfig";
import {GET_FLAG, POST_FLAG} from "../config/requestMethods";

class Majax {
    private _store
    private _requestQueue
    private _responseQueue
    private _requestInterceptor
    private _responseInterceptor

    public config

    constructor(opts) {
        this.config = mergeConfig(_defaults, opts)
        this._store = {}
        this._requestQueue = new Queue()
        this._responseQueue = new Queue()
    }

    public setRequestInterceptor (interceptor) {
        this._requestInterceptor = interceptor
    }

    public setResponseInterceptor (interceptor) {
        this._responseInterceptor = interceptor
    }

    public request(opts) {
        return new Promise((resolve, reject) => {
            //init request instance & mixin resolver and rejecter
            //start request flow
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