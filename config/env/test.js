/**
 * Test environment settings
 */

module.exports = {

  hookTimeout: 900000,

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
  port: '1339',

  hooks: {
    "grunt": false,
    "session": false,
    "csrf": false,
    "views": false
  }
};
