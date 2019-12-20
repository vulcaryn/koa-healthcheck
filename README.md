# koa-healthcheck

A simple koa middleware to monitor the API.

## Install

```bash
npm i --save koa-healthcheck
```

## Configuration

### Check structure

Every check object must looks like:

```js
const check = {
  name: 'The optional check name',
  type: '<check type>', /* "db" or "ping" */
  configuration: {},
};
```

Attributes:

- **name**: *optional*, he's used in the response of the '/healthcheck' to identify the state of each check. Default value is `no-name-` with an index of this check.
- **type**: *required*, if the type isn't defined, the check will be skipped.
- **configuration**: *required*, contain a specific configuration for your check.

### DB check

A DB check object must looks like:

```js
const myDBCheck = {
  type: 'db',
  // URIs aren't supported, pass parameters separately. For Sequelize configuration, see https://sequelize.org/v5/manual/getting-started.html
  configuration: {
    database: 'my-db',
    username: null,
    password: null,
    options: {
      host: 'localhost',
      dialect: /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' | 'sqlite' */
    },
  }
};
```

### Ping check

A ping check object must looks like:

```js
const myPingCheck = {
  type: 'ping',
  configuration: {
    url: 'http://my-awesome-site.io/another-url',
  },
};
```

## How to use it

In the index of your project:

```js
const Koa = require('koa');
// Import the middleware:
const healthcheckPlugin = require('koa-healthcheck');

const app = new Koa();

// Just setup the middleware:
healthcheckPlugin(app, {
  // Array of custom checks
  "checks": [myDBCheck, myPingCheck],
  "routes": {
    "healthcheck": true,
    "metrics": true,
    "ping": true,
    "version": true
  },
  "version": "0.1-rc"
});

app.listen(3456); // enjoy !
```

NOTE: the plugin has to be added as close to `app.listen` as possible, i.e. after definition and configuration of `koa-helmet`, `session`, `compression`, etc. in order for them to be effective.

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
- `1` when the check is NOT

### Version

Return the current version of your application based on the setup.

```
GET http://my-api.com/version
HTTP/1.1 200 OK
"X.Y.Z"
```

### Metrics

Return the number of requests returned with 2XX, 4XX and 5XX status.

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

To be able to monitor databases (Mysql, Postgres, sqlite) we're using [Sequelize](http://docs.sequelizejs.com/).
