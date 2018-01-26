'use strict';

const Koa = require('koa');
const healthcheck = require('../index');

const app = new Koa();
const checks = [{
    name: 'awesome-site',
    type: 'ping',
    configuration: {
        url: 'http://my-awesome-site.io/ping',
    },
}, {
    name: 'sqlite',
    type: 'db',
    configuration: {
        database: 'my-db',
        username: null,
        password: null,
        options: {
            storage: './tests.sqlite',
            dialect: 'sqlite'
        },
    },
}, {
    type: 'ping',
    configuration: {
        url: 'http://my-awesome-site.io/another-url',
    },
}]

healthcheck.setup(checks, '1.6.3');

app.use(healthcheck.routes);

const server = app.listen(3456);

module.exports = server;
