export default class Queue {
    private _queue

    constructor() {
        this._queue = []
    }

    public enqueue(m) {
        this._queue.push(m)
    }

    public unqueue() {
        return this._queue.shift()
    }

    public hasNext() {
        return this._queue.length > 0
    }
}