/**
 * Test File: Testing User Model
 * File Location: test/models/User.spec.js
 */
require('../utils/globalBefore.js');

var should = require('should');

describe('The User Model', function() {

    before(function(done) {
        // purge users from test db before testing
        User.destroy({}, function(err) {
            if (err) throw err;
            Passport.destroy({}, function(err) {
                if (err) throw err;
                done();
            });
        });
    });

    describe('when accessing the User model', function() {
        var userData = {
            first_name: 'Robert',
            last_name: 'Bob',
            username: 'bobby',
            email: 'bobby@email.com',
            role: 'admin'
        };

        it('should begin with no users',  function(done) {
            User.count(function(err, users) {
                users.should.be.exactly(0);
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

    describe('after creating a user', function() {
        var user;
        before(function(cb) {
            var userData = {
                first_name: 'Robert',
                last_name: 'Bob',
                username: 'bobby',
                email: 'bobby@email.com',
                role: 'admin'
            };
            User.create(userData, function(err, newUser) {
                if (err) return cb(err);
                user = newUser;
                cb();
            });
        });

        it('should retrieve all users as json', function(done) {
            User.getAll().then(function(users) {
                users[0].should.not.have.lengthOf(0);
                done();
            });
        });

        it('should retrieve a user as json given an id', function(done) {
            User.getOne(user.id).then(function(user) {
                user[0].username.should.equal('bobby');
                done();
            });
        });

        after(function(cb) {
            user.destroy(function(err) {
                cb(err);
            });
        });
    });
});