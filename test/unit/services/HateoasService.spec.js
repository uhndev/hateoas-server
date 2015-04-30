 /**
 * Test File: Testing HateoasService
 * File Location: test/controllers/HateoasService.spec.js
 */

var HateoasService = require('../../../api/services/HateoasService');
var login = require('../utils/login');
var Q = require('q');

describe('HATEOAS Engine', function () {

  var adminUserId;
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

	});

});