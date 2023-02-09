const _ = require('lodash');

class Fetch {
    constructor(container) {
        this.utility = container.resolve('utility');
        this.utility.invoker = this.utility.common.invoker;
        this.constants = this.utility.constants;
        this.profileLogic = container.resolve('profileLogic');
        this.forwardFunctions = {
            FETCH: {
                name: 'FETCH',
                action: 'fetch'
            },
            RETREIVE: {
                name: 'RETREIVE',
                action: 'retreive'
            }
        }
    }

    async handleRequest(req, res) {

        let vendorId, projections, type = this.forwardFunctions.RETREIVE.name;

        const isRetreivalByPhoneNumber = _.get(req, 'query.byPhoneNumber', null);

        if (!isRetreivalByPhoneNumber) {
            vendorId = req.get(this.constants.general.vendorHeaderKey) || null;
            projections = _.get(req, 'query.projections', null);
            projections = projections ? _.split(projections, ',') : null;
            type = this.forwardFunctions.FETCH.name;
        }

        // validate input
        const inputMeta = { vendorId, projections, phoneNumber: isRetreivalByPhoneNumber },
            [fetchErr, fetchMeta] = await this.utility.invoker(this.profileLogic[this.forwardFunctions[type].action](inputMeta));

        if (fetchErr)
            return res.status(400).json({
                data: null,
                message: 'User could not be fetched'
            });

        const response = {
            data: fetchMeta,
            message: 'Vendor fetched successfully'
        };
        
        return res.status(200).json(response);
    }
}

module.exports = Fetch;