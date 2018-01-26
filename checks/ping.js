'use strict';

const request = require('async-request');

async function ping({ url }) {
    if (!url) { return 1; }
    
    const { statusCode, body } = await request(url);

    if (statusCode === 200 && body === 'pong') {
        return 0;
    }
    return 1;
}

module.exports = ping;
