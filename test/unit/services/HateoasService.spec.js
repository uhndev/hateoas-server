 /**
 * Test File: Testing HateoasService
 * File Location: test/controllers/HateoasService.spec.js
 */

var HateoasService = require('../../../api/services/HateoasService');

describe('HATEOAS Engine', function () {

  var adminUserId;
  var agent;

  describe('User with Admin Role', function () {
		
		before(function(done) {
	  	auth.authenticate('admin', function(loginAgent, resp) {
	  		agent = loginAgent;
	  		resp.statusCode.should.be.exactly(200);
	  		done();
	  	});
	  });

	  after(function(done) {
	  	auth.logout(done);
	  });  

	});

});