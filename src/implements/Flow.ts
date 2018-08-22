import Chain from "./Chain";

export default abstract class Flow {
    private _flows: Array<Chain> = []
    private _index: Number

    constructor() {
        this._index = 0
    }

    public addFlow(flow: Chain) {
        if (this._index > 0) {
            this._flows[this._index - 1].setSuccessor(flow)
        }

        this._flows.push(flow)
        this._index++
        console.log(this._flows)
    }

    public addFlows(flows: Array<Chain>) {
        this._flows = [...this._flows, ...flows]
    }

    public action(spec: any) {
        this._flows[0].accept(spec)
    }
}