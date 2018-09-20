import {matchInstance, matchType} from "./matcher";
import {TYPE_ARRAY, TYPE_OBJECT, TYPE_STRING} from "../config/baseType";
import {warnIf} from "./conditionCheck";
import {ALL} from "../config/regexp";
import Strategy from "../core/Strategy";

/**
 * @desc check url if has matched strategy rule, only the first rule is valid
 * @param rules
 * @param url
 * */
const findMatchStrategy = (rules: Array<Strategy> | Strategy, url: any) => {
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

const matchRule = (rule: Strategy, url: any) => {
    return (
        rule.urlExp === url ||                                 // rule.urlExp match url
        rule.urlExp === ALL ||                                 // rule.urlExp is "*" (all contains)
        (                                                      // rule.urlExp is instance of RegExp, test url with it
            matchInstance(rule.urlExp, RegExp) &&
            rule.urlExp.test(url)
        )
    )
}

export default findMatchStrategy