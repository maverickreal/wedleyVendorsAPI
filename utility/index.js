const Common = require('./common.js'),
    common = new Common(),
    CredentialGenerator = require('./credentialGenerator.js'),
    credentialGenerator = new CredentialGenerator(),
    constants = require('./constants');

module.exports = {
    common,
    credentialGenerator,
    constants
}