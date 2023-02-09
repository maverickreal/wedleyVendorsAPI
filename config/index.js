const prodConfig = require('./config-prod.js'),
    config = (process.env.ACTIVE_ENV === 'PRODUCTION' ? prodConfig : null);

module.exports = config;