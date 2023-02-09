const router = (require('express')).Router(),
	_ = require('lodash'),
	routerVersion1 = require('./v1/router.js');

router.use('/v1.[0-9]+.[0-9]+', (req, res, next) => {
	next();
}, routerVersion1);

module.exports = router;