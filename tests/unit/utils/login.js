'use strict';
var superagent = require('superagent'),
		agent = superagent.agent();

/**
 * Generic helper function to authenticate specified user with current sails testing instance. Function
 * will call specified callback function with response (res) body, which contains all necessary user data.
 *
 * @param   {String}    user    User which to use within login
 * @param   {Function}  next    Callback function which is called after login attempt
 */

module.exports.authenticate = function authenticate(user, done) {
  // Static credential information, which are used within tests.
  var credentials = {
    registered: {
      identifier: 'newuser',
      password: 'user1234'
    },
    admin: {
      identifier: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    }
  };

  request.post('/auth/local')
    .set('Content-Type', 'application/json')
    .send(credentials[user])
    .end(function (err, result) {
      if (err) throw err;
      agent.saveCookies(result);
      done(agent, result);
    });
};

module.exports.logout = function logout(done) {
	request.get('/logout')
		.end(function (err, res) {
			if (err) throw err;
			res.statusCode.should.be.exactly(302);
			done();
		});
};