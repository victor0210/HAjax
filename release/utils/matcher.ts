export const matchType = (variable, type) => {
    return typeof variable === type
}

export const matchInstance = (variable, instance) => {
    return variable instanceof instance
}

/**
 * @desc only check base type of javascript if exist in array
 * @param variable: target for checking
 * @param collection: source for checking
 * */
export const containedInArr = (variable, collection) => {
    if (!collection || !Array.isArray(collection)) return false

    return collection.indexOf(variable) !== -1
}