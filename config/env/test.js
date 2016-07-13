/**
 * Test environment settings
 */

module.exports = {

  hookTimeout: 900000,
  appUrl: 'http://localhost:1339',
  models: {
    migrate: 'drop',
    connection: 'altum_test'
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
  },

  fhir: {
    //'http://try-fhirplace.hospital-systems.com'
    //'http://fhirtest.uhn.ca/baseDstu2'
    baseUrl: 'http://fhirtest.uhn.ca/baseDstu2'
  }
};
