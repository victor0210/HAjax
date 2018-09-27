import {
    AND_MARK, EMPTY, END_SLASH, EQUAL_MARK, MULTIPLE_SLASH, QUESTION_MARK, SINGE_SLASH,
    URL_PREFIX
} from "../src/config/regexp";

const urlFormat = (baseUrl: String, url: String, params?: Object): String => {
    url.replace(MULTIPLE_SLASH, SINGE_SLASH)

    if (params) {
        url.replace(END_SLASH, EMPTY)
        url += QUESTION_MARK

        let paramsTarget = []
        for (let k in params) {
            paramsTarget.push(`${k}${EQUAL_MARK}${params[k]}`)
        }

        url += paramsTarget.join(AND_MARK)
    }

    if (URL_PREFIX.test(url)) return url
    if (baseUrl) url = `${baseUrl}${SINGE_SLASH}${url}`

    return encodeURI(url)
}

export default urlFormat