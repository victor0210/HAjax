import Chain from "../implements/Chain";
import Request from "../core/Request";

export default class RequestHandler extends Chain {
    _fuck(config): any {
        const request = new Request(config)

        console.log(request)
        this.pass(request)
    }
}