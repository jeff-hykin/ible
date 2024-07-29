export const wordList = (str, {keepTrailingSeparators=false,allowLongSplits=false}={}) => {
    const addedSeperator = str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/[^a-zA-Z0-9 _.-]/,"_").toLowerCase()
    if (allowLongSplits) {
        return addedSeperator.split(/[ _.-]/g).filter(each=>keepTrailingSeparators||each)
    }
    const words = addedSeperator.split(/[ _.-]+/g).filter(each=>keepTrailingSeparators||each)
    return words
}

export const toKebabCase = (str, {keepTrailingSeparators=false, allowLongSplits=false}={}) => {
    const words = wordList(str, {keepTrailingSeparators, allowLongSplits})
    return words.map(each=>each.toLowerCase()).join('-')
}