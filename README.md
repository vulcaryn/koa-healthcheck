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
  type: 'The check type',
  configuration: {},
};
```
Attributes:
- **name**: *optional*, he's used in the response of the '/healtcheck' to identify the state of each check. Default value is `no-name-` with ine index of this check.
- **type**: *required*, if the type isn't defined, the check will be skipped.
- **configuration**: *required*, contain a specific configuration for your check.

### DB check
A DB check object must looks like:
```js
const mySequelizeConf = {
  database: 'my-db',
  username: null,
  password: null,
  options: {
    storage: './tests.sqlite',
    dialect: 'sqlite'
  },
};

const myDBCheck = {
  type: 'db',
  configuration: mySequelizeConf
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
const myChecks = [myDBCheck, myPingCheck]; 
const versionOfMyApp = '1.2.3';

// Just setup the middleware:
healthcheckPlugin(app, myChecks, versionOfMyApp);

app.listen(3456); // enjoy !
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
