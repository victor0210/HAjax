import Queue from "implements/Queue";
import Response from "core/Response";

export default class ResponseQueue implements Queue {
    private _queue: Array<Response>

    constructor(initialQueue: Array<Response>) {
        this._queue = initialQueue
    }

    enqueue(item): void {
        this._queue.push(item)
    }

    unqueue(): Response {
        return this._queue.unshift()
    }
}