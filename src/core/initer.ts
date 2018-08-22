import ResponseHandler from "../flows/ResponseHandler";
import RequestChecker from "../flows/RequestChecker";
import Flow from "../implements/Flow";
import ResponseChecker from "../flows/ResponseChecker";
import RequestHandler from "../flows/RequestHandler";
import defaults from "../config/initConfig";
import MAJAX from "../core/majax";

export const initConfig = (userDef) => {
    MAJAX.prototype.config = Object.assign({}, defaults, userDef)
}

export const initFlow = () => {
    const flow = new Flow()

    flow.addFlows([
        new RequestHandler(),
        new RequestChecker(),
        new ResponseHandler(),
        new ResponseChecker()
    ])

    MAJAX.prototype.flow = flow
}