import Request from '../src/core/Request'
import urlFormat from "./urlFormat";

const createXHR = (r: Request) => {
    const xhr = new XMLHttpRequest();

    configInject(xhr, r)

    return xhr
}

const configInject = (xhr, r) => {
    xhrUtils.common(xhr, r)
}

const xhrUtils = {
    common: (xhr, config) => {
        //config special and open xhr
        xhrUtils[config.method](xhr, config)

        //headers
        for (let header in config.headers) {
            xhr.setRequestHeader(header, config.headers[header]);
        }

        //withCredentials
        xhr.withCredentials = config.withCredentials
    },
    get: (xhr, config) => {
        //config common
        xhr.open(
            'GET',
            urlFormat(config.baseUrl, config.url, config.params),
            true
        )
    },

    post: (xhr, config) => {
        xhr.open(
            'POST',
            urlFormat(config.baseUrl, config.url),
            true
        )
    }
}

export default createXHR