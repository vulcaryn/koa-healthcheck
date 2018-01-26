const router = require('koa-router')();
const { ping, healthcheck, version } = require('./handlers');

router
  .get('/ping', ping)
  .get('/version', version)
  .get('/healthcheck', healthcheck);

module.exports = router.routes();
