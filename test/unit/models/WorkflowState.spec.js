/**
 * Test File: Testing WorkflowState Model
 * File Location: test/models/WorkflowState.spec.js
 */

var should = require('should');
var workflowFixtures = require('../../fixtures/workflowstate.json');

describe('The WorkflowState Model', function () {

  var formHrefs = {};

  before(function (done) {
    SystemForm.find().exec(function (err, forms) {
      _.each(forms, function (form) {
        formHrefs[form.form_name] = 'http://localhost:1336/api/systemform/' + form.id;
      });
      done(err);
    });
  });

  describe('when accessing the WorkflowState model', function () {

    it('should begin with the correct WorkflowStates', function (done) {
      WorkflowState.count(function (err, states) {
        states.should.be.exactly(workflowFixtures.length);
        done(err);
      });
    });

    it('should return the correct user form in template href', function (done) {
      WorkflowState.findOne({model: 'user'})
        .exec(function (err, state) {
          state.template.href.should.equal(formHrefs.user);
          done(err);
        });
    });

    it('should return the correct study form in template href', function (done) {
      WorkflowState.findOne({model: 'study'})
        .exec(function (err, state) {
          state.template.href.should.equal(formHrefs.study);
          done(err);
        });
    });

    it('should return the correct collection centre form in template href', function (done) {
      WorkflowState.findOne({model: 'collectioncentre'})
        .exec(function (err, state) {
          state.template.href.should.equal(formHrefs.collection_centre);
          done(err);
        });
    });

  });
});
