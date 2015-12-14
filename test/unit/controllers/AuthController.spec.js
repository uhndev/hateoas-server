	/**
 * Test File: Testing AuthController
 * File Location: tests/unit/controllers/AuthController.spec.js
 *
 * Tests the following routes:
	'get /logout'               : 'AuthController.logout',
	'post /auth/local'          : 'AuthController.callback'
 */

var AuthController = require('../../../api/controllers/AuthController');

describe('The Auth Controller', function() {

	describe('when accessing Auth API', function() {

		it('should use the correct test database', function(done) {
			sails.config.models.connection.should.equal('arm_test');
			done();
		});

		it('should return 403 when logging in with bad credentials', function(done) {
			auth.authenticate('badlogin', function(resp) {
				resp.statusCode.should.be.exactly(403);
				done();
			});
		});

		it('should return 200 when logging in with good credentials', function(done) {
			auth.authenticate('admin', function(resp) {
				resp.statusCode.should.be.exactly(200);
				done();
			});
		});

		it('should be ok after accessing /logout', function(done) {
			request.get('/logout')
				.end(function (err, res) {
					if (err) throw err;
					res.statusCode.should.be.exactly(200);
					done();
				});
		});

		it('should return the user data and JWT after logging in', function(done) {
			auth.authenticate('admin', function(resp) {
				resp.res.body.should.have.properties('user', 'group', 'token');
				done();
			});
		})
	});
});
