const _ = require('lodash');

class vendorMeta {
    constructor(container) {
        this.utility = container.resolve('utility');
        this.utility.invoker = this.utility.common.invoker;
        this.constants = this.utility.constants;
        this.profileLogic = container.resolve('profileLogic');
        this.forwardFunctions = {
            META: {
                name: 'META',
                action: 'fetchMeta',
                responseName: 'user',
                statsRequired: true,
                profileImageUrlRequired: true
            },
            KYC: {
                name: 'KYC',
                action: 'fetchKyc',
                responseName: 'data',
                statsRequired: false,
                profileImageUrlRequired: false
            }
        }
    }

    async handleRequest(req, res) {
        const section = _.upperCase(req.params.section),
            vendorId = req.get(this.constants.general.vendorHeaderKey) || null,
            pageNumber = req.query.pageNumber || -1,
            type = this.forwardFunctions[section].name,
            inputMeta = { vendorId, pageNumber },
            [fetchErr, fetchMeta] = await this.utility.invoker(this.profileLogic[this.forwardFunctions[type].action](inputMeta));

        if (fetchErr)
            return res.status(400).json({
                data: null,
                message: 'User could not be fetched'
            });

        const stats = { percentageCompleted: 51 };

        if (this.forwardFunctions[section].profileImageUrlRequired && fetchMeta.profileImageUrl == null) {
            fetchMeta.profileImageUrl = 'https://wedley-production-data-store.sgp1.digitaloceanspaces.com/f008bbfe-cdbe-40bb-a78e-65a2cadc0b38.png';
        }

        const response = { message: 'Details fetched successfully' };
        response[this.forwardFunctions[section].responseName] = fetchMeta;
        if (this.forwardFunctions[section].statsRequired) {
            response.stats = stats;
        }

        return res.status(200).json(response);
    }
}

module.exports = vendorMeta;