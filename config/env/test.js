/**
 * Test environment settings
 */

module.exports = {

  models: {
    migrate: 'drop',
    connection: 'arm_test'
  },

  // configuration for testing purposes
  log: {
    level: 'error',
    noShip: true
  },

  environment: 'test',
  port: '1338',

  hooks: {
    "grunt": false,
    "csrf": false
  }
};
