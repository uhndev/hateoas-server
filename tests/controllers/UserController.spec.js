 /**
 * Test File: Testing UserController
 * File Location: test/controllers/UserController.spec.js
 *
    'get /api/user'         : 'UserController.getAll',
    'get /api/user/:id'     : 'UserController.getOne',
    'post /api/user'        : 'UserController.create',
    'delete /api/user/:id'  : 'UserController.delete',
 */
 
require('../utils/globalBefore.js');

var UserController = require('../../api/controllers/UserController'),
    should = require('should'),
    request = require('supertest');

describe('The User Controller', function() {

    // initialize fake user data
    var model = {
        first_name: 'Alice',
        last_name: 'Bob',
        username: 'alice',
        password: 'Password123',
        email: 'alice@email.com',
        role: 'admin'         
    };

    before(function(done) {
        request = request('http://localhost:'+sails.config.port);
        done();
    });

    // describe('when unauthorized, prevent access to User API', function() {
        
    //     it('should be forbidden from retrieving all users', function(done) {
    //         request
    //             .get('/api/user')
    //             .end(function (err, res) {
    //                 if (err) throw err;
    //                 res.statusCode.should.be.exactly(302);
    //                 done();
    //             });
    //     });

    //     it('should be forbidden from retrieving a user', function(done) {
    //         request
    //             .get('/api/user/1')
    //             .end(function (err, res) {
    //                 if (err) throw err;
    //                 res.statusCode.should.be.exactly(302);
    //                 done();
    //             });
    //     });

    //     it('should be forbidden from creating a user', function(done) {
    //         request
    //             .post('/api/user')
    //             .send(model)
    //             .end(function (err, res) {
    //                 if (err) throw err;
    //                 res.statusCode.should.be.exactly(403);
    //                 done();
    //             });
    //     });

    //     it('should be forbidden from deleting a user', function(done) {
    //         request
    //             .delete('/api/user/1')
    //             .end(function (err, res) {
    //                 if (err) throw err;
    //                 res.statusCode.should.be.exactly(403);
    //                 done();
    //             });
    //     });
    // });

    // describe('when authorized, allow access to User API', function() {
        
    //     it('should be allowed to retrieve all users', function(done) {
    //         request
    //             .get('/api/user')
    //             .end(function (err, res) {
    //                 if (err) throw err;
    //                 res.statusCode.should.be.exactly(302);
    //                 done();
    //             });
    //     });

    //     it('should be allowed to retrieve a user', function(done) {
    //         request
    //             .get('/api/user/1')
    //             .end(function (err, res) {
    //                 if (err) throw err;
    //                 res.statusCode.should.be.exactly(302);
    //                 done();
    //             });
    //     });

    //     it('should be allowed to create a user', function(done) {
    //         request
    //             .post('/api/user')
    //             .send(model)
    //             .end(function (err, res) {
    //                 if (err) throw err;
    //                 res.statusCode.should.be.exactly(403);
    //                 done();
    //             });
    //     });

    //     it('should be allowed to delete a user', function(done) {
    //         request
    //             .delete('/api/user/1')
    //             .end(function (err, res) {
    //                 if (err) throw err;
    //                 res.statusCode.should.be.exactly(403);
    //                 done();
    //             });
    //     });
    // });
});