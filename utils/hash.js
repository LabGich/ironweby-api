const {hash, compare} = require("bcryptjs")

const doHash = (value, saltValue) => {
    const result = hash(value, saltValue)
    return result
}

const doHashValidation = (value, hashedValue) => {
    const result = compare(value, hashedValue)
    return result
}

module.exports = {doHash, doHashValidation}