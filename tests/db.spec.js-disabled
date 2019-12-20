'use strict';

const db = require('../checks/db');
const chai = require('chai');
const should = chai.should();

const configuration = {
    database: 'my-db',
    username: null,
    password: null,
    options: {
        storage: './tests.sqlite',
    },
};

describe('DB', () => {
    it('should return 0 if the database is available', async () => {
        const mysql = Object.assign({}, configuration);
        mysql.options.dialect = 'sqlite';

        const result = await db(configuration);
        result.should.eql(0);
    });

    it('should return 1 if the database isn\'t available', async () => {
        const mysql = Object.assign({}, configuration);
        mysql.options.dialect = 'mysql';

        const result = await db(configuration);
        result.should.eql(1);
    });

    it('should fail if the configuration isn\'t correct', async () => {
        const result = await db({});
        result.should.eql(1);
    });
});