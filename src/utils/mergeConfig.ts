import {matchType} from "./matcher";
import {TYPE_OBJECT} from "../config/baseType";

const mergeConfig = (defaults, opts) => {
    if (!matchType(opts, TYPE_OBJECT)) return defaults

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