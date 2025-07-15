const {hash} = require("bcryptjs")

const doHash = (value, saltValue) => {
    const result = hash(value, saltValue)
    return result
}

module.exports = doHash