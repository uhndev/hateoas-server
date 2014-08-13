/**
 * Test File: Testing AuthController
 * File Location: test/controllers/AuthController.spec.js
 *
 * Tests the following routes:
    'get /login'                : 'AuthController.login',
    'get /logout'               : 'AuthController.logout',
    'get /admin'                : 'AuthController.admin',
    'post /auth/local'          : 'AuthController.callback',
    'post /auth/local/:action'  : 'AuthController.callback',
 */

require('../utils/globalBefore.js');

var AuthController = require('../../api/controllers/AuthController'),
    should = require('should'),
    request = require('supertest');

var model = {
    first_name: 'Robert',
    last_name: 'Bob',
    username: 'bobby',
    email: 'bobby@email.com',
    role: 'admin'
};    

describe('The Auth Controller', function() {

    before(function(done) {
        request = request('http://localhost:'+sails.config.port);
        // temporarily disable csrf for testing
        global.sails.config.csrf.grantTokenViaAjax = false;
        global.sails.config.csrf.protectionEnabled = false;
        done();
    });

    describe('when accessing Auth API', function() {

        it('should use the correct test database',  function(done) {
            sails.config.models.connection.should.equal('dados_test');
            done();
        });

        it('should allow access to /admin only on empty user db', function(done) {
            request.get('/admin')
                .end(function (err, res) {
                    if (err) throw err;
                    res.statusCode.should.be.exactly(200);
                    done();
                });
        });

        it('should be able to post bad login credentials', function(done) {
            var login = {
                identifier: 'bobby',
                password: 'Password123'
            };
            request.post('/auth/local')
                .send(login)
                .end(function (err, res) {
                    if (err) throw err;
                    res.statusCode.should.be.exactly(400);
                    done();
                });
        });

        it('should be fail to register with cracklib unapproved password', function(done) {
            var tmp = model;
            tmp.password = 'Password123';

            request.post('/auth/local/register')
                .send(tmp)
                .end(function (err, res) {
                    if (err) throw err;
                    res.statusCode.should.be.exactly(400);
                    done();
                });
        });

        it('should be able to register with cracklib approved password', function(done) {
            var tmp = model;
            tmp.password = 'BetterPW345';

            request.post('/auth/local/register')
                .send(tmp)
                .end(function (err, res) {
                    if (err) throw err;
                    res.statusCode.should.be.exactly(200);
                    done();
                });
        });        

        it('should deny access to /admin with non-empty user db', function(done) {
            request.get('/admin')
                .end(function (err, res) {
                    if (err) throw err;
                    res.statusCode.should.be.exactly(302);
                    done();
                });
        });

        it('should be able to login while logged in', function(done) {
            var login = {
                identifier: 'bobby',
                password: 'BetterPW345'
            };
            request.post('/auth/local')
                .send(login)
                .end(function (err, res) {
                    if (err) throw err;
                    res.statusCode.should.be.exactly(200);
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

        it('should allow access /login when not logged in', function(done) {
            request.get('/login')
                .end(function (err, res) {
                    if (err) throw err;
                    res.statusCode.should.be.exactly(200);
                    done();
                });
        });

        it('should be able to post good login credentials and login', function(done) {
            var login = {
                identifier: 'bobby',
                password: 'BetterPW345'
            };
            request.post('/auth/local')
                .send(login)
                .end(function (err, res) {
                    if (err) throw err;
                    res.statusCode.should.be.exactly(200);
                    done();
                });
        });
    });
});