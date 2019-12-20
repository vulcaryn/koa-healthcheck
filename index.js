'use strict';

const router = require('koa-router')();
const checks = require('./checks');
const paths = ['/ping', '/version', '/healthcheck', '/metrics'];

function healthcheckPlugin(app, parameters) {
  const count = {
    Http2XX: 0,
    Http4XX: 0,
    Http5XX: 0,
  };

  async function healthcheck(ctx) {
    const result = {};
    const promises = parameters.checks.map((check) => {
      return checks(check);
    });

    await Promise.all(promises)
      .then((data) => {
        parameters.checks.map((check, index) => {
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

  if (parameters.routes.healthcheck) router.get('/healthcheck', healthcheck);
  if (parameters.routes.metrics) router.get('/metrics', (ctx) => { ctx.body = count; });
  if (parameters.routes.ping) router.get('/ping', (ctx) => { ctx.body = 'pong'; })
  if (parameters.routes.version) router.get('/version', (ctx) => { ctx.body = parameters.version; });


  app.use(metricsMiddleware);
  app.use(router.routes());
}

module.exports = healthcheckPlugin;
