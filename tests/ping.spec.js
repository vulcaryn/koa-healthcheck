'use strict';

const ping = require('../checks/ping');
const nock = require('nock');
const chai = require('chai');
const should = chai.should();

const HOST = 'http://my-awesome-site.io';

const configuration = {
    url: `${HOST}/ping`
}

describe('Ping', () => {
    it('should return 0 if the response is "pong"', async () => {
        nock(HOST).get('/ping').reply(200, 'pong');
        const result = await ping(configuration);
        result.should.eql(0);
    });

    it('should return 1 if the response isn\'t "pong"', async () => {
        nock(HOST).get('/ping').reply(200, 'ping');
        const result = await ping(configuration);
        result.should.eql(1);
    });

    it('should return 1 if it\'s a failure', async () => {
        nock(HOST).get('/ping').reply(500);
        const result = await ping(configuration);
        result.should.eql(1);
    });

    it('should fail if the configuration doesn\'t contain the "url" attribute', async () => {
        const result = await ping({});
        result.should.eql(1);
    });
});