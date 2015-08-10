/**
 * Test File: Testing WorkflowState Model
 * File Location: test/models/WorkflowState.spec.js
 */

var should = require('should');

describe('The WorkflowState Model', function() {

	var formHrefs = {};

	before(function (done) {
		SystemForm.find().exec(function (err, forms) {
			_.each(forms, function(form) {
				formHrefs[form.form_name] = 'http://localhost:1338/api/systemform/' + form.id;
			});
			done(err);
		});
	});

	describe('when accessing the WorkflowState model', function() {

		it('should begin with user, subject, study, and collection centre WorkflowStates',  function (done) {
			WorkflowState.count(function(err, states) {
				states.should.be.exactly(5);
				done(err);
			});
		});

		it('should return the correct user form in template href', function (done) {
			WorkflowState.findOne({ path: '/api/user' })
				.exec(function (err, state) {
					state.template.href.should.equal(formHrefs.user);
					done(err);
				});
		});

		it('should return the correct subject form in template href', function (done) {
			WorkflowState.findOne({ path: '/api/subjectenrollment' })
				.exec(function (err, state) {
					state.template.href.should.equal(formHrefs.subject);
					done(err);
				});
		});

		it('should return the correct study form in template href', function (done) {
			WorkflowState.findOne({ path: '/api/study' })
				.exec(function (err, state) {
					state.template.href.should.equal(formHrefs.study);
					done(err);
				});
		});

		it('should return the correct collection centre form in template href', function (done) {
			WorkflowState.findOne({ path: '/api/collectioncentre' })
				.exec(function (err, state) {
					state.template.href.should.equal(formHrefs.collection_centre);
					done(err);
				});
		});
	});
});
