/**
 * Test environment settings
 */

module.exports = {

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
    "csrf": false
  }
};
