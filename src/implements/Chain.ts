export default abstract class Chain {
    private _successor: Chain

    /**
     * @name _fuck
     * @description every chain core function
     *
     * @param spec: param which pass in the responsibility of chain
     * @return any: param what pass to the next successor
     * */
    _fuck(spec): any {}

    public setSuccessor(successor: Chain) {
        this._successor = successor
    }

    public accept(spec: any) {
        this._fuck(spec)
    }

    public pass(spec) {
        this._successor && this._successor.accept(spec)
    }
}