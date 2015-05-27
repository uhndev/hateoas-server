/**
 * Test File: Testing WorkflowState Model
 * File Location: test/models/WorkflowState.spec.js
 */

var should = require('should');

describe('The WorkflowState Model', function() {

	var formHrefs = {};

	before(function (done) {
		Form.find().exec(function (err, forms) {
			_.each(forms, function(form) {
				formHrefs[form.form_name] = 'http://localhost:1337/api/form/' + form.id;
			});
			done(err);
		});
	});

	describe('when accessing the WorkflowState model', function() {

		it('should begin with user, person, subject, and study WorkflowStates',  function (done) {
			WorkflowState.count(function(err, states) {
				states.should.be.exactly(4);
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
			WorkflowState.findOne({ path: '/api/subject' })
				.exec(function (err, state) {
					state.template.href.should.equal(formHrefs.subject);
					done(err);
				});
		});
		
		it('should return the correct person form in template href', function (done) {
			WorkflowState.findOne({ path: '/api/person' })
				.exec(function (err, state) {
					state.template.href.should.equal(formHrefs.person);
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
	});
});