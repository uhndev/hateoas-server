/**
 * Utility script for ensuring that sails.js has lifted fully before running tests.
 */

var Sails = require('sails'),
  sails;

request = require('supertest');
auth = require('./unit/utils/auth');
should = require('should');
Promise = require('bluebird');
globals = {
  users: {},
  subjects: {},
  groups: {},
  studies: {},
  collectioncentres: {},
  token: ''
};

before(function (done) {
  this.timeout(900000);
  Sails.lift({
    environment: 'test',
    hooks: {
      grunt: false
    }
  }, function(err, server) {
    sails = server;
    if (err) return done(err);

    // Shared request variable
    request = request(sails.hooks.http.app);

    var createSubject = function () {
      auth.createUser(auth.credentials['subject'].create, function (subId) {
        globals.users.subjectUserId = subId;
        Subject.create({
          user: subId
        }).exec(function (err, subject) {
          globals.subjects.subjectId = subject.id;
        });
      });
    };

    var createInterviewer = function () {
      auth.createUser(auth.credentials['interviewer'].create, function (intId) {
        globals.users.interviewerUserId = intId;
      });
    };

    var createCoordinator = function () {
      auth.createUser(auth.credentials['coordinator'].create, function (cooId) {
        globals.users.coordinatorUserId = cooId;
      });
    };

    Group.find().then(function (groups) {
        _.each(groups, function (group) {
          globals.groups[group.name] = group.id;
        });
      })
      .then(createSubject)
      .then(createInterviewer)
      .then(createCoordinator)
      .then(function () {
        done(err, sails);
      });
  });
});

after(function (done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
