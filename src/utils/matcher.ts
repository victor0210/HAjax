export const matchType = (variable, type) => {
    return typeof variable === type
}

export const matchInstance = (variable, instance) => {
    return variable instanceof instance
}

export const containedInArr = (variable, collection) => {
    return collection.indexOf(variable) !== -1
}