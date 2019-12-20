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
                        'no-name-1': 1,
                    });
                    done();
                });
        });
    });

    describe('Metrics', () => {
        it('should return the number of request groupped by status', (done) => {
            chai.request(server).get(`/200`).end();
            chai.request(server).get(`/200`).end();
            chai.request(server).get(`/400`).end();
            chai.request(server).get(`/500`).end();
            chai.request(server).get(`/metrics`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.body.should.eql({
                        Http2XX: 2,
                        Http4XX: 1,
                        Http5XX: 1,
                    });
                    done();
                });
        });
    });
});
