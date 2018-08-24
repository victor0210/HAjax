class Queue {
    private _queue

    constructor() {
        this._queue = []
    }

    public enqeueue(m) {
        this._queue.push(m)
    }

    public unqueue() {
        return this._queue.shift()
    }
}