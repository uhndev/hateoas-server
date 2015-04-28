 /**
 * Test File: Testing UserController
 * File Location: test/controllers/UserController.spec.js
 *
 * Tests the following routes:
	'get /api/user'         : 'UserController.getAll',
	'put /api/user/:id'     : 'UserController.update',
	'post /api/user'        : 'UserController.create'
 */

var UserController = require('../../../api/controllers/UserController');
var login = require('../utils/login');

describe('The User Controller', function () {

  var adminUserId;
  var newUserId;
  var agent;

  describe('User with Admin Role', function () {
		
		before(function(done) {
	  	login.authenticate('admin', function(loginAgent, resp) {
	  		agent = loginAgent;
	  		resp.statusCode.should.be.exactly(200);
	  		done();
	  	});
	  });

	  after(function(done) {
	  	login.logout(done);
	  });

    describe('Admin retrieving all users', function () {
	    it('should be able to read all users', function (done) {
	    	var req = request.get('/api/user');
	    	agent.attachCookies(req);
	    	req.set('Accept', 'application/collection+json')
	    		.expect('Content-Type', 'application/collection+json; charset=utf-8')
	    		.expect(200)
	        .end(function (err, res) {
	          var collection = JSON.parse(res.text);
	          collection.items[0].username.should.equal(process.env.ADMIN_USERNAME);
	          adminUserId = collection.items[0].id;
	          done(err);
	        });
	    });
  	});

		describe('Admin creating a user', function () {
	    it('should be able to create a new user', function (done) {
	    	var req = request.post('/api/user');
	    	agent.attachCookies(req);

	      req.set('Accept', 'application/collection+json')
	    		.expect('Content-Type', 'application/collection+json; charset=utf-8')
	    		.send({
	          username: 'newuser',
	          email: 'newuser@example.com',
	          password: 'user1234'
	        })
	        .expect(200)
	        .end(function(err, res) {
	          var collection = JSON.parse(res.text);
	          collection.items.username.should.equal('newuser');
	          newUserId = user.id;
	          done(err);
	        });
	    });

	    it('should return an error if a user already exists', function (done) {
	      var req = request.post('/api/user');
	    	agent.attachCookies(req);

	      req.set('Accept', 'application/json')
	    		.expect('Content-Type', 'application/json; charset=utf-8')
	      	.send({
	          username: 'newuser',
	          email: 'newuser@example.com',
	          password: 'user1234'
	        })
	        .expect(500)
	        .end(function(err) {
	          done(err);
	        });
	    });
	  });
 	});

  describe('User with Registered Role', function () {

  	before(function(done) {
	  	login.authenticate('registered', function(loginAgent, resp) {
	  		agent = loginAgent;
	  		resp.statusCode.should.be.exactly(200);
	  		done();
	  	});
	  });

	  after(function(done) {	  	
	  	login.authenticate('admin', function(loginAgent, resp) {
	  		agent = loginAgent;
	  		var req = request.del('/api/user/' + newUserId);
	  		agent.attachCookies(req);
	  		req.send().expect(200).end(function (err, res) {
	  			login.logout(done);
	  		})
	  	});
	  });

    describe('Registered user creating a user', function () {
      it('should not be able to create a new user', function (done) {
      	var req = request.post('/api/user');
	    	agent.attachCookies(req);
        
        req.set('Accept', 'application/json')
	    		.expect('Content-Type', 'application/json; charset=utf-8')
          .send({
            username: 'newuser1',
            email: 'newuser1@example.com',
            password: 'lalalal1234'
          })
          .expect(400)
          .end(function (err, res) {
            // var user = res.body;
            var collection = JSON.parse(res.text);
            collection.error.should.equal('User newuser@example.com is not permitted to POST ');
            done(err);
          });
      });
    });

    describe('Registered users updating a user', function () {
      it('should be able to update themselves', function (done) {
      	var req = request.put('/api/user/' + newUserId);
	    	agent.attachCookies(req);

	    	req.send({ email: 'newuserupdated@example.com' })
          .expect(200)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            collection.items.email.should.equal('newuserupdated@example.com');
            done(err);
          });
      });

      it('should not be able to update another user', function (done) {
      	var req = request.put('/api/user/' + adminUserId);
	    	agent.attachCookies(req);

        req.send({ email: 'crapadminemail@example.com' })
          .expect(400)
          .end(function (err, res) {
            var collection = JSON.parse(res.text);
            collection.error.should.equal('Cannot perform action [update] on foreign object');
            done(err);
          });
      });
    });
  });

});