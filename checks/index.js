'use strict';

const ping = require('./ping');
const db = require('./db');

async function check(check) {
    switch (check.type) {
        case 'ping':
            return ping(check.configuration);
        case 'db':
            return db(check.configuration)
    }
}

module.exports = check;
