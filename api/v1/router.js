const router = (require('express')).Router();

router.post('/internal/vendors', (req, res) => {
	req.container.resolve('createProfileApi').handleRequest(req, res);
});

router.get('/internal/vendors', (req, res) => {
	req.container.resolve('fetchProfileApi').handleRequest(req, res);
});

router.put('/vendors/profile/:section', (req, res) => {
	req.container.resolve('putVendorMetaApi').handleRequest(req, res);
});

router.get('/vendors/profile/:section', (req, res) => {
	req.container.resolve('fetchVendorMetaApi').handleRequest(req, res);
});

module.exports = router;