import urlFormat from "./urlFormat";

const createXHR = (requestInstance) => {
    const xhr = new XMLHttpRequest();

    configInject(xhr, requestInstance)

    return xhr
}

const configInject = (xhr, requestInstance) => {
    xhrUtils.common(xhr, requestInstance)
}

const xhrUtils = {
    common: (xhr, config) => {
        //config special and open xhr
        xhrUtils[config.method](xhr, config)

        //headers
        for (let header in config.headers) {
            xhr.setRequestHeader(header, config.headers[header]);
        }

        xhr.responseType = config.responseType
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