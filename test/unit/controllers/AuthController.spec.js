	/**
 * Test File: Testing AuthController
 * File Location: tests/unit/controllers/AuthController.spec.js
 *
 * Tests the following routes:
	'get /logout'               : 'AuthController.logout',
	'post /auth/local'          : 'AuthController.callback'
 */

var AuthController = require('../../../api/controllers/AuthController'),
		should = require('should'),
		login = require("../utils/login");

describe('The Auth Controller', function() {

	describe('when accessing Auth API', function() {

		it('should use the correct test database',  function(done) {
			sails.config.models.connection.should.equal('dados_test');
			done();
		});

		it('should return 403 when logging in with bad credentials', function(done) {
			login.authenticate('subject', function(agent, resp) {
				resp.statusCode.should.be.exactly(403);
				done();
			});
		});

		it('should return 200 when logging in with good credentials', function(done) {
			login.authenticate('admin', function(agent, resp) {
				resp.statusCode.should.be.exactly(200);
				done();
			});
		});

		it('should redirect to login page when accessing /logout', function(done) {
			request.get('/logout')
				.end(function (err, res) {
					if (err) throw err;
					res.statusCode.should.be.exactly(302);
					done();
				});
		});

		it('should return the username and roles after logging in', function(done) {
			login.authenticate('admin', function(agent, resp) {
				resp.res.body.should.have.properties('username', 'role')
				done();
			});
		})
	});
});