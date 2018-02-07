'use strict';

const router = require('koa-router')();
const checks = require('./checks');
const paths = ['/ping', '/version', '/healthcheck', '/metrics'];

function healthcheckPlugin(app, checksConf, version) {
  const count = {
    Http2XX: 0,
    Http4XX: 0,
    Http5XX: 0,
  };

  async function healthcheck(ctx) {
    const result = {};
    const promises = checksConf.map((check) => {
      return checks(check);
    });

    await Promise.all(promises)
      .then((data) => {
        checksConf.map((check, index) => {
          result[check.name || `no-name-${index}`] = data[index];
        });
      });

    ctx.body = result;
  }

  async function metricsMiddleware(ctx, next) {
    await next();
    if (paths.includes(ctx.path)) {
      return;
    }
    if (ctx.status >= 200 && ctx.status < 300) {
      count.Http2XX++;
    }
    if (ctx.status >= 400 && ctx.status < 500) {
      count.Http4XX++;
    }
    if (ctx.status >= 500 && ctx.status < 600) {
      count.Http5XX++;
    }
  }

  router
    .get('/ping', (ctx) => { ctx.body = 'pong'; })
    .get('/version', (ctx) => { ctx.body = version; })
    .get('/healthcheck', healthcheck)
    .get('/metrics', (ctx) => { ctx.body = count; });

  app.use(metricsMiddleware);
  app.use(router.routes());
}

module.exports = healthcheckPlugin;
