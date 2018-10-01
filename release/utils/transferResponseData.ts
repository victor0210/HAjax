import {RESPONSE_TYPE_TEXT} from "../config/responseTypes";
import {matchType} from "./matcher";
import {TYPE_OBJECT} from "../config/baseType";

const transferResponseData = (xhr) => {
    switch (xhr.responseType) {
        case RESPONSE_TYPE_TEXT:
            return xhr.response
        default:
            return matchType(xhr.response, TYPE_OBJECT)
                ? xhr.response
                : JSON.parse(xhr.response)
    }
}

export default transferResponseData