'use strict';

const chai = require('chai');
const nock = require('nock');
const chaiHttp = require('chai-http');
const server = require('./testServer');

const HOST = 'http://my-awesome-site.io';
const should = chai.should();
chai.use(chaiHttp);

describe('Routes:', () => {
    describe('Ping', () => {
        it('should return "pong"', (done) => {
            chai.request(server)
                .get(`/ping`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.text.should.eql('pong');
                    done();
                });
        });
    });

    describe('Version', () => {
        it('should return the version passed in setup', (done) => {
            chai.request(server)
                .get(`/version`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.text.should.eql('1.6.3');
                    done();
                });
        });
    });

    describe('Healthcheck', () => {
        it('should return the status of all dependencies', (done) => {
            nock(HOST)
                .get('/ping').reply(200, 'pong')
                .get('/another-url').reply(500);

            chai.request(server)
                .get(`/healthcheck`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.body.should.eql({
                        'awesome-site': 0,
                        'sqlite': 0,
                        'no-name-2': 1,
                    });
                    done();
                });
        });
    });
});