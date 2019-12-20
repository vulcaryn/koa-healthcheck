'use strict';

const request = require('request-promise-native');
const state = require('./state');

async function ping(configuration) {
    if (!configuration.url) { return state.DOWN; }

    const result = await request(configuration.url).then((res) => {
        return res === 'pong';
    }).catch(() => {
        return false;
    });
    if (result) {
        return state.UP;
    }
    return state.DOWN;
}

module.exports = ping;
