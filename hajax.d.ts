declare interface Config {
    baseURL: string
    url: string
    method: string
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

declare interface HAjax {
    _requestDealTarget: HRequest
    _responseDealTarget: HResponse
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

declare interface HRequest {
    _uuid: number
    _onFulfilled: Function
    _onFailed: Function
    url: string
    method: string
    baseURL: string
    fullURL: string
    headers: object
    params: object
    data: object
    timeout: number
    withCredentials: boolean
    responseType: string
    xhr: XMLHttpRequest
    config: Config
    withRushStore: boolean
    hajaxInstance: HAjax
    aborted: boolean
    retryLimit: number
    retryBuffer: number
    mode: string
    debounceTime: number
    throttleTime: number
}

declare interface HResponse {
    data: any
    status: number
    statusText: string
    headers: object
    config: Config
    request: HRequest
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