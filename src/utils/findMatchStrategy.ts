import {matchInstance, matchType} from "./matcher";
import {TYPE_ARRAY, TYPE_OBJECT} from "../config/baseType";
import {warnIf} from "./conditionCheck";

/**
 * @desc check url if has matched strategy rule, only the first rule is valid
 * @param rules
 * @param url
 * */
const findMatchStrategy = (rules, url) => {
    let matchedRule = null

    if (Array.isArray(rules)) {
        // return the first matched rule
        rules.some((rule: any) => {
            const validStrategy = matchType(rule, TYPE_OBJECT)

            // just warn without block request flow
            warnIf(
                !validStrategy,
                `invalid param storeStrategy, expect [${TYPE_OBJECT}] | [${TYPE_ARRAY}] but got ${typeof rule}`
            )

            if (validStrategy && matchRule(rule, url)) {
                matchedRule = rule
                return true
            }
        })
    } else {
        const validStrategy = matchType(rules, TYPE_OBJECT)

        // just warn without block request flow
        warnIf(
            !validStrategy,
            `invalid param storeStrategy, expect [${TYPE_OBJECT}] | [${TYPE_ARRAY}] but got ${typeof rules}`
        )

        if (validStrategy && matchRule(rules, url)) matchedRule = rules
    }

    if (matchedRule) return matchedRule
}

const matchRule = (rule, url) => {
    return (
        rule.url === url ||                                 // rule.url match url
        rule.url === '*' ||                                 // rule.url is "*" (all contains)
        (                                                   // rule.url is instance of RegExp, test url with it
            matchInstance(rule.url, RegExp) &&
            rule.url.test(url)
        )
    )
}

export default findMatchStrategy