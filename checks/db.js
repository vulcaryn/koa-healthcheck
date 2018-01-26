'use strict';

const Sequelize = require('sequelize');

async function db({ database, username, password, options }) {
    if (!database || !options || !options.dialect) { return 1; }

    const instance = new Sequelize(database, username, password, options);

    const result = await instance.authenticate()
        .then(() => 0)
        .catch(() => 1);

    instance.close();

    return result;
}

module.exports = db;
