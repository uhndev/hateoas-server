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
  roles: {},
  users: {},
  studies: {},
  collectioncentres: {}
};

before(function(done) {
  console.log('Lifting sails...');
  this.timeout(15000);
  Sails.lift({
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
    console.log("Loading test fixtures...");
    Role.find().exec(function (err, roles) {
      var roleIds = _.pluck(roles, 'id');
      globals.roles.adminRoleId = roleIds[0];
      globals.roles.coordinatorRoleId = roleIds[1];
      globals.roles.interviewerRoleId = roleIds[2];
      globals.roles.subjectRoleId = roleIds[3];

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
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});