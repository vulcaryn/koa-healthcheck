# koa-healthcheck

A simple koa middleware to monitor the API.

## Install
```bash
npm i --save koa-healthcheck
```

## How to use it
In the index of your project:
```js
// Import the middleware:
const healthcheck = require('koa-healthcheck');

// Just setup the middleware:
healthcheck.setup(myConfiguration, versionOfMyApp);

// Enable the metric monitoring to count requests
koa.use(healthcheck.metricMiddleware);

// Apply the middleware to koa:
koa.use(healthcheck.routes());
```

## Features
### Ping
Check if the API is up and return "pong"
```
GET http://my-api.com/ping
HTTP/1.1 200 OK
"pong"
```

### Healthcheck
Check the state of whole dependencies of your app.

Return and object of states.
```
GET http://my-api.com/healthcheck
HTTP/1.1 200 OK
{
    "my-first-check": 0,
    "my-second-check": 0,
    "my-third-check": 0
}
```
The key is the name of the test.
The value possible are :
- `0` when the check is OK
- `1` when the check is KO

### Version
Return the current version of your application based on the setup.
```
GET http://my-api.com/version
HTTP/1.1 200 OK
"X.Y.Z"
```

### Metrics
Return the amont of request returned with 2XX, 4XX and 5XX status.
```
GET http://my-api.com/metrics
HTTP/1.1 200 OK
{
    "Http2XX": 2,
    "Http4XX": 1,
    "Http5XX": 1
}
```

## Test it
```bash
npm run test
```

## Dependencies
To be able to monitor databases (Mysql, Postrges, sqlite) we're using [Sequelize](http://docs.sequelizejs.com/).
