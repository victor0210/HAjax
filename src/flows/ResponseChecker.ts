import Chain from "../implements/Chain";
import Request from "../core/Request";

export default class ResponseChecker extends Chain {
    _fuck(request: Request): any {
        request.send()
    }
}