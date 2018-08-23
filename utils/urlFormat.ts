const urlFormat = (
    baseUrl: String,
    url: String,
    params?: object
): String => {
    url.replace(/[/][/]+/, '/')

    if (params) {
        url.replace(/[/]$/, '')
        url += '?'

        let paramsTarget = []
        for (let k in params) {
            paramsTarget.push(`${k}=${params[k]}`)
        }

        url += paramsTarget.join('&')
    }

    if (/^http|^https/.test(url)) return url
    if (baseUrl) url = `${baseUrl}/${url}`

    return encodeURI(url)
}

export default urlFormat