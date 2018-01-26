'use strict';

const check = require('./checks');

let configuration = {
    healthchecks: [],
    version: false,
};

async function ping(ctx) {
  ctx.body = 'pong';
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

async function version(ctx) {
  ctx.body = configuration.version;
}

function setup(healthcheckList, version) {
    if (typeof healthcheckList === 'object' && healthcheckList.length >= 0) {
        configuration.healthchecks = healthcheckList;
    }
    
    if (version) {
        configuration.version = version;
    }
}

module.exports = {
    setup,
    ping,
    healthcheck,
    version,
};
