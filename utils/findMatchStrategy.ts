const findMatchStrategy = (rules, url) => {
    //check rules format

    let matchedRule = null

    //if object
    //if array
    rules.some((rule: any) => {
        if (rule.url === url || rule.url === '*') {
            matchedRule = rule
            return true
        }
    })

    if (matchedRule) return matchedRule
}

export default findMatchStrategy