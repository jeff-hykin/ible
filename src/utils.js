module.exports = {
    wrapIndex(val, list) {
        if (val >= list.length) {
            return 0
        } else if (val < 0) {
            return list.length-1
        } else {
            return val
        }
    }
}