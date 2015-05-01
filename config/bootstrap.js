/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */
var Q = require('q');
var Barrels = require('barrels');

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  // Load fixtures
  var barrels = new Barrels();

  // Save original objects in `fixtures` variable
  fixtures = barrels.data;

  // Populate the DB
  console.log("Loading fixtures...");

  barrels.populate(['form'], function(err) {

  	Form.find()
  		.then(function (forms) {
				var data = _.zip(forms, fixtures.workflowstate);
	  		_.map(data, function (state) {
	  			var formId = state[0].id,
	  					formName = state[0].form_name;
	  			state[1].template.href = 'http://localhost:1337/api/form/' + formId;
		  	});
		  	return data;
	  	})
	  	.then(function (data) {
	  		fixtures.workflowstate = _.unzip(data)[1];
	  		barrels.populate(['workflowstate'], function (err) {
	  			cb(err);	
	  		});	  		
	  	});  	
  	
  });  
};
