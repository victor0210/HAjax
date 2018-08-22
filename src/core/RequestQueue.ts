import Queue from "implements/Queue";
import Request from "core/Request";

export default class RequestQueue implements Queue {
    private _queue: Array<Request>

    constructor(initialQueue: Array<Request>) {
        this._queue = initialQueue
    }

    enqueue(item): void {
        this._queue.push(item)
    }

    unqueue(): Request {
        return this._queue.unshift()
    }
}