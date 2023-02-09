const _ = require('lodash'),
    { v4: uuid } = require('uuid');

class CredentialGenerator {
    constructor() { }

    getNewUserId() {
        let firstRandom = _.last(_.split(uuid(), '-')),
            secondRandom = Date.now(),
            rawRandom = `${firstRandom}${secondRandom}`,
            finalHash = _.join(_.shuffle(rawRandom), '');

        return finalHash;
    }

    getNewSecret() {
        return uuid();
    }
}

module.exports = CredentialGenerator;