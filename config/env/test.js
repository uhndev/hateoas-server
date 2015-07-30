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

  hooks: {
    "grunt": false,
    "csrf": false
  }
};
