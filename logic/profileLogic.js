const _ = require('lodash');

class ProfileLogic {
    constructor(container) {
        this.utility = container.resolve('utility');
        this.constants = this.utility.constants;
        this.utility = container.resolve('utility');
        this.utility.invoker = this.utility.common.invoker;
        this.vendorRepo = container.resolve('vendorRepo');
        this.kycPagesRepo = container.resolve('kycPagesRepo');
    }

    async fetch(meta) {
        return await this.vendorRepo.fetchVendor(meta.vendorId, meta.projections);
    }

    async retreive(meta) {
        return await this.vendorRepo.retreiveVendor(meta.phoneNumber);
    }

    async fetchMeta(meta) {
        return await this.vendorRepo.fetchProfileMeta(meta.vendorId);
    }

    async putMeta(meta) {
        return await this.vendorRepo.putProfileMeta(meta.vendorId, meta.meta);
    }

    async fetchKyc(meta) {
        let pageNumber = meta.pageNumber;
        if (pageNumber > this.constants.general.pageCount || pageNumber < 0)
            pageNumber = -1;

        return await this.kycPagesRepo.fetchProfileKyc(meta.vendorId, pageNumber);
    }

    async putKyc(meta) {
        return await this.kycPagesRepo.putProfileKyc(meta.vendorId, meta.meta);
    }

    async create(meta) {

        const vendorId = this.utility.credentialGenerator.getNewUserId(),
            vendorSecret = this.utility.credentialGenerator.getNewSecret();

        _.set(meta, 'secret', vendorSecret);
        let [createErr, createdMeta] = await this.utility.invoker(this.vendorRepo.createVendor(vendorId, meta));
        if (createErr)
            return Promise.reject(createErr);

        return Promise.resolve({ id: vendorId, secret: vendorSecret });
    }
}

module.exports = ProfileLogic;