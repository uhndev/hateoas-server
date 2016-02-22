/**
 * Test environment settings
 */

module.exports = {

  appUrl: 'http://localhost:1336',
  models: {
    migrate: 'drop',
    connection: 'dados_test'
  },

  // configuration for testing purposes
  log: {
    level: 'error',
    noShip: true
  },

  environment: 'test',
  port: '1336',

  hooks: {
    "grunt": false,
    "session": false,
    "csrf": false,
    "views": false
  }
};
