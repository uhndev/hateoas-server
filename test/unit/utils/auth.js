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

var Auth = {

  credentials: {
    badlogin: {
      login: {
        identifier: 'badlogin',
        password: 'badpassword'
      }
    },
    subject: {
      create: {
        username: 'subject',
        email: 'subject@example.com',
        password: 'subject1234',
        role: 'subject'
      },
      login: {
        identifier: 'subject',
        password: 'subject1234'
      }
    },
    coordinator: {
      create: {
        username: 'coordinator',
        email: 'coordinator@example.com',
        password: 'coordinator1234',
        role: 'coordinator'
      },
      login: {
        identifier: 'coordinator',
        password: 'coordinator1234'
      }
    },
    admin: {
      create: {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin1234',
        role: 'admin'
      },
      login: {
        identifier: 'admin',
        password: 'admin1234'
      }
    }
  },

  createUser: function(credentials, done) {
    this.authenticate('admin', function(agent, resp) {
      var req = request.post('/api/user');
      agent.attachCookies(req);
      req.send(credentials)
      .expect(201)
      .end(function(err, res) {
        done(JSON.parse(res.text).items.id);
      });
    });    
  },

  authenticate: function(user, done) {
    request.post('/auth/local')
      .set('Content-Type', 'application/json')
      .send(this.credentials[user].login)
      .end(function (err, result) {
        if (err) throw err;
        agent.saveCookies(result);
        done(agent, result);
      });
  },

  logout: function(done) {
    request.get('/logout')
      .end(function (err, res) {
        if (err) throw err;
        res.statusCode.should.be.exactly(302);
        done();
      });
  }
};

module.exports = Auth;