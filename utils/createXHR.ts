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
        //config common
        xhr.open(
            config.method.toUpperCase(),
            urlFormat(config.baseUrl, config.url, config.params)
        )

        //headers
        for (let header in config.headers) {
            xhr.setRequestHeader(header, config.headers[header]);
        }

        xhr.responseType = config.responseType
        //withCredentials
        xhr.withCredentials = config.withCredentials
    }
}

export default createXHR