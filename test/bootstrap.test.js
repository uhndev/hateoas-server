/**
 * Utility script for ensuring that sails.js has lifted fully before running tests.
 */

var Barrels = require('barrels');
var Sails = require('sails'),
    sails;

request = require('supertest');
auth = require('./unit/utils/auth');
should = require('should');
globals = {
  users: {},
  studies: {},
  collectioncentres: {}
};

before(function(done) {
  console.log('Lifting sails...');
  this.timeout(30000);
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
    console.log("Loading test fixtures...");

    auth.createUser(auth.credentials['subject'].create, function(subId) {
      globals.users.subjectUserId = subId; 
      auth.createUser(auth.credentials['interviewer'].create, function(intId) {
        globals.users.interviewerUserId = intId;
        auth.createUser(auth.credentials['coordinator'].create, function(cooId) {
          globals.users.coordinatorUserId = cooId;
          done(err, sails);
        });
      });
    });
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
