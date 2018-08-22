import Chain from "../implements/Chain";

export default class RequestChecker extends Chain {
    _fuck(config): any {
        console.log('checker', config)
    }
}