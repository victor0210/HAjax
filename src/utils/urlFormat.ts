import {
    ABSOLUTE_PATH, AND_MARK, EMPTY, END_SLASH, EQUAL_MARK, HEAD_SLASH, QUESTION_MARK, SINGE_SLASH
} from "../config/regexp";

const urlFormat = (baseUrl: string = SINGE_SLASH, relativeUrl: string, params?: object): string => {
    let url

    if (isAbsolute(relativeUrl)) {
        url = relativeUrl
    } else {
        url = relativeUrl
            ? baseUrl.replace(END_SLASH, EMPTY) + SINGE_SLASH + relativeUrl.replace(HEAD_SLASH, EMPTY)
            : baseUrl.replace(END_SLASH, SINGE_SLASH);
    }

    return buildUrl(url, params)
}

const buildUrl = (url, params) => {
    if (params) {
        url.replace(END_SLASH, EMPTY)
        url += QUESTION_MARK

        let paramsTarget = []
        for (let k in params) {
            paramsTarget.push(`${k}${EQUAL_MARK}${params[k]}`)
        }

        url += paramsTarget.join(AND_MARK)
    }

    return url.replace(END_SLASH, EMPTY)
}

const isAbsolute = (url) => {
    return ABSOLUTE_PATH.test(url)
}

export default urlFormat