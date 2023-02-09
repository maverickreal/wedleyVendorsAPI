const { createContainer, asValue } = require('awilix'),
    container = new createContainer(),
    // Foundation
    config = require('../config'),
    model = require('../model'),
    utility = require('../utility');

container.register({
    config: asValue(config),
    utility: asValue(utility),
    model: asValue(model)
});
// -------------------------------------------------------------- //
// Repo layer
const VendorRepo = require('../repository/database/vendorRepo.js'),
    vendorRepo = new VendorRepo(container);

container.register('vendorRepo', asValue(vendorRepo));

const KycPagesRepo = require('../repository/database/kycPagesRepo.js'),
    kycPagesRepo = new KycPagesRepo(container);

container.register('kycPagesRepo', asValue(kycPagesRepo));
// -------------------------------------------------------------- //
// Logic layer
const ProfileLogic = require('../logic/profileLogic.js'),
    profileLogic = new ProfileLogic(container);

container.register('profileLogic', asValue(profileLogic));
// -------------------------------------------------------------- //
// API layer
const CreateProfileApi = require('../api/v1/vendor/create.js'),
    createProfileApi = new CreateProfileApi(container);

container.register('createProfileApi', asValue(createProfileApi));

const FetchProfileApi = require('../api/v1/vendor/fetch.js'),
    fetchProfileApi = new FetchProfileApi(container);

container.register('fetchProfileApi', asValue(fetchProfileApi));

const FetchVendorMetaApi = require('../api/v1/profile/meta.js'),
    fetchVendorMetaApi = new FetchVendorMetaApi(container);

container.register('fetchVendorMetaApi', asValue(fetchVendorMetaApi));

const PutVendorMetaApi = require('../api/v1/profile/update.js'),
    putVendorMetaApi = new PutVendorMetaApi(container);

container.register('putVendorMetaApi', asValue(putVendorMetaApi));

module.exports = container;