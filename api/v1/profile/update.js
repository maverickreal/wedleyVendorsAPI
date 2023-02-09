const _ = require('lodash');

class vendorMetaUpdate {
    constructor(container) {
        this.utility = container.resolve('utility');
        this.utility.invoker = this.utility.common.invoker;
        this.constants = this.utility.constants;
        this.profileLogic = container.resolve('profileLogic');
        this.forwardFunctions = {
            META: {
                name: 'META',
                action: 'putMeta'
            },
            KYC: {
                name: 'KYC',
                action: 'putKyc'
            }
        }
    }

    async handleRequest(req, res) {

        const section = _.upperCase(req.params.section),
            vendorId = req.get(this.constants.general.vendorHeaderKey) || null,
            type = this.forwardFunctions[section].name,
            meta = req.body,
            inputMeta = { vendorId, meta },
            [putErr] = await this.utility.invoker(this.profileLogic[this.forwardFunctions[type].action](inputMeta));

        if (putErr)
            return res.status(400).json({
                message: 'User could not be updated!'
            });
        ;
        return res.status(200).json({ message: 'Details put successfully' });
    }

}

module.exports = vendorMetaUpdate;