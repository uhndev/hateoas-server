'use strict';

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
        group: 'subject',
        prefix: 'Mr.',
        firstName: 'Sub',
        lastName: 'Ject'
      },
      login: {
        identifier: 'subject',
        password: 'subject1234'
      }
    },
    interviewer: {
      create: {
        username: 'interviewer',
        email: 'interviewer@example.com',
        password: 'interviewer1234',
        group: 'interviewer',
        prefix: 'Mr.',
        firstName: 'Inter',
        lastName: 'Viewer'
      },
      login: {
        identifier: 'interviewer',
        password: 'interviewer1234'
      }
    },
    coordinator: {
      create: {
        username: 'coordinator',
        email: 'coordinator@example.com',
        password: 'coordinator1234',
        group: 'coordinator',
        prefix: 'Dr.',
        firstName: 'Coord',
        lastName: 'Inator'
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
        group: 'admin',
        prefix: 'Dr.',
        firstName: 'John',
        lastName: 'Admin'
      },
      login: {
        identifier: 'admin',
        password: 'admin1234'
      }
    }
  },

  createUser: function (credentials, done) {
    this.authenticate('admin', function (agent, resp) {
      request.post('/api/user')
        .set('Authorization', 'Bearer ' + globals.token)
        .send(credentials)
        .expect(201)
        .end(function (err, res) {
          done(JSON.parse(res.text).items.id);
        });
    });
  },

  authenticate: function (user, done) {
    request.post('/auth/local')
      .send(this.credentials[user].login)
      .end(function (err, result) {
        if (err) throw err;
        if (_.has(result.body, 'token')) globals.token = result.body.token.payload;
        done(result);
      });
  },

  logout: function (done) {
    request.get('/logout')
      .end(function (err, res) {
        if (err) throw err;
        res.statusCode.should.be.exactly(200);
        done();
      });
  }
};

module.exports = Auth;
