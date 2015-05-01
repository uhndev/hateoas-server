/**
 * Utility script for ensuring that sails.js has lifted fully before running tests.
 */

var Barrels = require('barrels');
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
    port: 1336,
    // configuration for testing purposes
    log: {
      level: 'silent',
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
    
    // Shared request variable
    request = request(sails.hooks.http.app);

    // temporarily disable csrf for testing
    sails.config.csrf.grantTokenViaAjax = false;
    sails.config.csrf.protectionEnabled = false;

    // Load fixtures
    var barrels = new Barrels();

    // Save original objects in `fixtures` variable
    fixtures = barrels.data;

    // Populate the DB
    console.log("Loading fixtures...");
    barrels.populate(function(err) {
      done(err, sails);
    });
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});