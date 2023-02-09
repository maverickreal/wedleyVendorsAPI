const { Client } = require('pg'),
    _ = require('lodash'),
    fs = require('fs');

class kycPagesRepo {
    constructor(container) {
        this.table = 'kyc_pages';
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

    async putProfileKyc(vendorId, vendorMeta) {
        let valueString = ``,
            query = `SELECT * FROM ${this.table} WHERE "ID"='${vendorId}' ;`,
            [error, data] = await this.utility.invoker(this.dbClient.query(query));
        if (error)
            return Promise.reject(error);

        if (data.rowCount == 0) {
            query = `INSERT INTO ${this.table} ("ID") VALUES ('${vendorId}') ;`;
            [error] = await this.utility.invoker(this.dbClient.query(query));
            if (error)
                return Promise.reject(error);

            query = `SELECT * FROM ${this.table} WHERE "ID"='${vendorId}' ;`,
                [error, data] = await this.utility.invoker(this.dbClient.query(query));
            if (error)
                return Promise.reject(error);
        }

        for (let key in vendorMeta) {
            let keyColumn = key.toUpperCase();
            if (data.rows[0][keyColumn] !== undefined) {
                if (typeof vendorMeta[key] == 'object') {
                    let obj = vendorMeta[key],
                        items = `'`;

                    for (let x in obj)
                        items += obj[x] + `','`;
                    items = items.slice(0, -2);

                    valueString = `${valueString}"${keyColumn}"=ARRAY[${items}],`;
                }
                else
                    valueString = `${valueString}"${keyColumn}"='${vendorMeta[key]}',`;
            }
        }
        valueString = valueString.slice(0, -1);

        query = `UPDATE ${this.table} SET ${valueString} WHERE "ID"='${vendorId}';`;
        [error, data] = await this.utility.invoker(this.dbClient.query(query));

        return (error ? Promise.reject(error) : Promise.resolve(data));
    }

    async fetchProfileKyc(vendorId, pageNumber) {
        const query = `SELECT * FROM ${this.table} WHERE "ID"='${vendorId}' ;`,
            [error, data] = await this.utility.invoker(this.dbClient.query(query));
        if (error || data.rowCount == 0)
            return Promise.reject(error);

        if (pageNumber == -1) {
            for (let i = 0; i <= this.constants.general.pageCount && pageNumber == -1; i++) {
                const isFound = _.findIndex(_.keys(this.constants.general.kycPages[i]), col => _.isNil(data.rows[0][col]));
                if (isFound >= 0) {
                    pageNumber = i;
                    break;
                }
            }
            pageNumber = Math.max(pageNumber, 0);
        }

        let fields = { ...this.constants.general.kycPages[pageNumber], pageNumber };
        for (let field in fields)
            if (data.rows[0][field])
                fields[field].value = data.rows[0][field];

        return Promise.resolve(fields);
    }
}

module.exports = kycPagesRepo;