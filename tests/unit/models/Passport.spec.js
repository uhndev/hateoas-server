/**
 * Test File: Testing Passport Model
 * File Location: test/models/Passport.spec.js
 */

var should = require('should');

describe('The Passport Model', function() {
  describe('before the passport is created/modified', function(done) {
    it('should hash password before creating passport', function() {
      Passport.beforeCreate({
        password: 'password'
      }, function (err, user) {
        user.password.should.not.equal('password');
      })
    });

    it('should hash password before updating passport', function() {
      Passport.beforeUpdate({
        password: 'password'
      }, function (err, user) {
        user.password.should.not.equal('password');
      })
    });
  });
});