export const throwIf = (condition, msg) => {
    if (condition) throw new Error(`[Error]: ${msg} !`)
}

export const warnIf = (condition, msg) => {
    if (condition) window.console.warn(`[Warning]: ${msg} .`)
}
