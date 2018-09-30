declare interface Config {
    baseUrl: string
    url: string
    method: string
    baseURL: string
    headers: object
    params: object
    mode: string
    retryLimit: number
    retryBuffer: number
    debounceTime: number
    throttleTime: number
    data: any
    timeout: number
    withCredentials: boolean
    responseType: any
}

declare interface Majax {
    _requestDealTarget: MRequest
    _responseDealTarget: MResponse
    store: object
    throttleStore: object
    debounceStore: object
    requestQueue: Queue
    responseQueue: Queue
    requestInterceptor: Function
    responseInterceptor: Function
    requestPool: object
    storeStrategy: Array<Strategy> | Strategy
    config: Config
}

declare interface MRequest {
    _uuid: number
    _onFulfilled: Function
    _onFailed: Function
    url: string
    method: string
    baseURL: string
    fullUrl: string
    headers: object
    params: object
    data: object
    timeout: number
    withCredentials: boolean
    responseType: string
    xhr: XMLHttpRequest
    config: Config
    withRushStore: boolean
    majaxInstance: Majax
    aborted: boolean
    retryLimit: number
    retryBuffer: number
    mode: string
    debounceTime: number
    throttleTime: number
}

declare interface MResponse {
    data: any
    status: number
    statusText: string
    headers: object
    config: Config
    request: MRequest
}

declare interface Strategy {
    urlExp: any
    bufferTime: number
}

declare interface Queue {
    _queue: Array<any>
    enqueue(item: any)
    unqueue(): any
    hasNext(): boolean
}