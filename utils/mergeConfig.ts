const mergeConfig = (defaults, opts) => {
    return {
        ...defaults,
        ...opts,

        //deep merge
        headers: {
            ...defaults.headers,
            ...opts.headers
        }
    }
}

export default mergeConfig