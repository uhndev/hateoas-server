/**
 * Utility script for ensuring that sails.js has lifted fully before running tests.
 */

var Sails = require('sails'),
    sails;

request = require('supertest');

// set temporary environment variables for testing
process.env.ADMIN_USERNAME = 'test_admin';
process.env.ADMIN_EMAIL = 'test_email@email.com';
process.env.ADMIN_PASSWORD = 'Test_Password';

before(function(done) {
  console.log('Lifting sails...');
  this.timeout(15000);
  Sails.lift({
    // configuration for testing purposes
    log: {
      level: 'error',
      noShip: true
    },
    models: {
      connection: 'dados_test',
      migrate: 'drop'
    },
    environment: 'test'
  }, function(err, server) {
    sails = server;
    if (err) return done(err);
    // here you can load fixtures, etc.

    request = request(sails.hooks.http.app);
    // temporarily disable csrf for testing
    sails.config.csrf.grantTokenViaAjax = false;
    sails.config.csrf.protectionEnabled = false;

    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});