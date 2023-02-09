const { Client } = require('pg'),
    _ = require('lodash'),
    fs = require('fs');

class VendorRepo {
    constructor(container) {
        this.table = 'vendor';
        this.config = container.resolve('config');
        this.dbClient = new Client({
            user: this.config.vendorsDb.userName,
            host: this.config.vendorsDb.host,
            database: this.config.vendorsDb.db,
            password: this.config.vendorsDb.password,
            port: this.config.vendorsDb.port,
            ssl: {
                ca: fs.readFileSync('/home/maverick/Documents/wedley/ca-certificate.crt')
            }
        });

        this.dbClient.connect();
        this.utility = container.resolve('utility');
        this.constants = this.utility.constants;
        this.utility.invoker = this.utility.common.invoker;
        this.model = container.resolve('model').vendor;
        this.mandatoryColumns = ['secret', 'phoneNumber', 'name', 'category', 'city'];
    }

    async fetchVendor(vendorId, projections) {
        let columns = _.isArray(projections) ? `"${_.join(projections, '","')}"` : '*';
        const query = `SELECT ${columns} FROM ${this.table} WHERE id='${vendorId}'`;
        let [vendorErr, vendorMeta] = await this.utility.invoker(this.dbClient.query(query));
        if (vendorErr)
            return Promise.reject(vendorErr);
        return Promise.resolve(vendorMeta.rows[0]);
    }

    async updateVendor(vendorId, vendorMeta) {

        let valueString = ``;
        for (let column of this.mandatoryColumns)
            valueString = `${valueString}${column}='${vendorMeta[column]}',`;
        valueString = valueString.slice(0, -1);

        const query = `UPDATE vendor SET ${valueString} WHERE id='${vendorId}'`,
            [vendorErr, updatedVendor] = await this.utility.invoker(this.dbClient.query(query));

        if (vendorErr)
            return Promise.reject(vendorErr);
        return Promise.resolve(updatedVendor);
    }

    async createVendor(vendorId, vendorMeta) {
        let valueString = ``;
        for (let column of this.mandatoryColumns)
            valueString = `${valueString}'${vendorMeta[column]}',`;

        valueString = valueString.slice(0, -1);
        const keyString = _.join(this.mandatoryColumns, '","'),
            query = `INSERT INTO vendor ("id","${keyString}") VALUES ('${vendorId}',${valueString})`;

        let [vendorErr, newVendor] = await this.utility.invoker(this.dbClient.query(query));
        if (vendorErr)
            return Promise.reject(vendorErr);
        return Promise.resolve();
    }

    async retreiveVendor(phoneNumber) {
        let columns = _.join(_.split(this.model.authColumns, ','), '","');
        const query = `SELECT "${columns}" FROM vendor WHERE "phoneNumber"=${phoneNumber}`;
        let [vendorErr, vendorMeta] = await this.utility.invoker(this.dbClient.query(query));
        if (vendorErr)
            return Promise.reject(vendorErr);
        return Promise.resolve(vendorMeta.rows[0]);
    }

    async fetchProfileMeta(vendorId) {
        const columns = _.join(_.split(this.model.vendorProfileColumns, ','), '","'),
            query = `SELECT "${columns}" FROM ${this.table} WHERE id='${vendorId}'`,
            [vendorErr, vendorMeta] = await this.utility.invoker(this.dbClient.query(query));

        if (vendorErr)
            return Promise.reject(vendorErr);
        return Promise.resolve(vendorMeta.rows[0]);
    }

    async putProfileMeta(vendorId, vendorMeta) {
        let valueString = ``;

        for (let key in vendorMeta)
            valueString = `${valueString}"${key}"='${vendorMeta[key]}',`;

        valueString = valueString.slice(0, -1);

        const query = `UPDATE ${this.table} SET ${valueString} WHERE "id"='${vendorId}';`,
            [vendorErr, updatedVendor] = await this.utility.invoker(this.dbClient.query(query));

        return (vendorErr ? Promise.reject(vendorErr) : Promise.resolve(updatedVendor));
    }
}

module.exports = VendorRepo;