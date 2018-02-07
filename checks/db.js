'use strict';

const Sequelize = require('sequelize');
const state = require('./state');

async function db({ database, username, password, options }) {
    if (!database || !options || !options.dialect) { return state.DOWN; }

    const instance = new Sequelize(database, username, password, options);

    const result = await instance.authenticate()
        .then(() => state.UP)
        .catch(() => state.DOWN);

    await instance.close();

    return result;
}

module.exports = db;
