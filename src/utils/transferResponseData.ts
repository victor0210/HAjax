import {RESPONSE_TYPE_TEXT} from "../config/responseTypes";

const transferResponseData = (xhr) => {
    switch (xhr.responseType) {
        case RESPONSE_TYPE_TEXT:
            return JSON.parse(xhr.response)
        default:
            return xhr.response
    }
}

export default transferResponseData