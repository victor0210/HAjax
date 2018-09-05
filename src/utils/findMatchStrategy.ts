import {matchType} from "./matcher";
import {TYPE_ARRAY, TYPE_OBJECT} from "../config/baseType";
import {throwIf} from "./conditionCheck";

const findMatchStrategy = (rules, url) => {
    let matchedRule = null

    if (Array.isArray(rules)) {
        // return the first matched rule
        rules.some((rule: any) => {
            if (rule.url === url || rule.url === '*') {
                matchedRule = rule
                return true
            }
        })
    } else {
        throwIf(
            !matchType(rules, TYPE_OBJECT),
            `invalid param storeStrategy, expect [${TYPE_OBJECT}] | [${TYPE_ARRAY}] but got ${typeof rules}`
        )

        matchedRule = rules
    }

    if (matchedRule) return matchedRule
}

export default findMatchStrategy