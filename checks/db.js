'use strict';

const Sequelize = require('sequelize');
const state = require('./state');

async function db(dbConfig) {
    if (!dbConfig.database || !dbConfig.options || !dbConfig.options.dialect) { return state.DOWN; }

    const instance = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig.options);

    const result = await instance.authenticate()
        .then(() => state.UP)
        .catch(() => state.DOWN);

    await instance.close();

    return result;
}

module.exports = db;
