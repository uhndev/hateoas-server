/**
 * Test File: Testing User Model
 * File Location: test/models/User.spec.js
 */

var should = require('should');

describe('The User Model', function() {

	describe('when accessing the User model', function() {
		var userData = {
			username: 'bobby',
			email: 'bobby@email.com',
			role: 'admin'
		};

		it('should begin with admin, subject, and coordinator users',  function(done) {
			User.count(function(err, users) {
				users.should.be.exactly(3);
				done();
			});
		});

		it('should fail to create user if missing username', function(done) {
			tmp = userData;
			tmp.username = '';
			User.create(tmp, function(err, newUser) {
				should.exist(err);
				done();
			});
		});

		it('should fail to create user if missing email', function(done) {
			tmp = userData;
			tmp.email = '';
			User.create(tmp, function(err, newUser) {
				should.exist(err);
				done();
			});
		});

		it('should fail to create user if missing role', function(done) {
			tmp = userData;
			tmp.role = '';
			User.create(tmp, function(err, newUser) {
				should.exist(err);
				done();
			});
		});
	});
});