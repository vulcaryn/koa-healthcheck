'use strict';

const request = require('request-promise-native');
const state = require('./state');

async function ping({ url }) {
    if (!url) { return state.DOWN; }
    
    const result = await request(url).then((res) => {
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
