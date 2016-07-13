var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'todotricks'
    },
    port: 3006,
    db: 'mongodb://localhost/todotricks-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'todotricks'
    },
    port: 3006,
    db: 'mongodb://localhost/todotricks-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'todotricks'
    },
    port: 3006,
    db: 'mongodb://localhost/todotricks-production'
  }
};

module.exports = config[env];
