const _ = require('lodash');

class Create {
    constructor(container) {
        this.utility = container.resolve('utility');
        this.utility.invoker = this.utility.common.invoker;
        this.profileLogic = container.resolve('profileLogic');
    }

    async handleRequest(req, res) {
        const payload = _.get(req, 'body', {}),
            // validate input here
            [createErr, userMeta] = await this.utility.invoker(this.profileLogic.create(payload));

        if (createErr)
            // logger
            return res.status(400).json({
                data: null,
                message: 'User could not be created'
            })

        const response = {
            data: userMeta,
            message: 'Vendor created successfully'
        }

        return res.status(200).json(response);
    }
}

module.exports = Create;