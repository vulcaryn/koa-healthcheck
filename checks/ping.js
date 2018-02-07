'use strict';

const request = require('async-request');
const state = require('./state');

async function ping({ url }) {
    if (!url) { return 1; }

    const { statusCode, body } = await request(url);

    if (statusCode === 200 && body === 'pong') {
        return state.UP;
    }
    return state.DOWN;
}

module.exports = ping;
