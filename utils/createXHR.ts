const createXHR = (config) => {
    const xhr = new XMLHttpRequest();

    configInject(xhr, config)

    return xhr
}

const configInject = (xhr, config) => {
    xhrUtils.common(xhr, config)
}

const xhrUtils = {
    common: (xhr, config) => {
        //config common
        xhr.open(
            config.method.toUpperCase(),
            config.url,
            true
        );

        //config special
        xhrUtils[config.method](xhr, config)
    },
    get: (xhr, config) => {

    },

    post: (xhr, config) => {

    }
}