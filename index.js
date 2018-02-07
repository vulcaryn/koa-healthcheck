'use strict';

const router = require('koa-router')();
const check = require('./checks');

const paths = ['/ping', '/version', '/healthcheck', '/metrics'];

let configuration = {
    healthchecks: [],
    version: false,
};

const counter = {
    response2XXCount: 0,
    response4XXCount: 0,
    response5XXCount: 0,
}

async function healthcheck(ctx) {
  const result = {};
  const promises = configuration.healthchecks.map((healthcheck) => {
      return check(healthcheck);
  });

  await Promise.all(promises)
    .then((data) => {
        configuration.healthchecks.map((healthcheck, index) => {
            result[healthcheck.name || `no-name-${index}`] = data[index];
        });
    });

  ctx.body = result;
}

function setup(healthcheckList, version) {
    if (typeof healthcheckList === 'object' && healthcheckList.length >= 0) {
        configuration.healthchecks = healthcheckList;
    }
    
    if (version) {
        configuration.version = version;
    }
}

async function metrics(ctx) {
    ctx.body = {
        Http2XX: counter.response2XXCount,
        Http4XX: counter.response4XXCount,
        Http5XX: counter.response5XXCount
    };
}

async function metricsMiddleware(ctx, next) {
    await next();
    if (paths.includes(ctx.path)) {
        return;
    }
    if (ctx.status >= 200 && ctx.status < 300) {
        counter.response2XXCount++;
    }
    if (ctx.status >= 400 && ctx.status < 500) {
        counter.response4XXCount++;
    }
    if (ctx.status >= 500 && ctx.status < 600) {
        counter.response5XXCount++;
    }
}

router
  .get('/ping', (ctx) => { ctx.body = 'pong'; })
  .get('/version', (ctx) => { ctx.body = configuration.version; })
  .get('/healthcheck', healthcheck)
  .get('/metrics', metrics);

module.exports = {
    setup,
    metricsMiddleware,
    routes: router.routes(),
};
