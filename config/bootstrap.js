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

var Barrels = require('barrels');

module.exports.bootstrap = function(cb) {

	// It's very important to trigger this callback method when you are finished
	// with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

	// Load fixtures
	var barrels = new Barrels();

	// Save original objects in `fixtures` variable
	fixtures = barrels.data;

	// Populate the DB
	console.log("Loading sails fixtures...");

	var formNames = _.pluck(fixtures.form, 'form_name');
	Form.find({form_name: formNames}).then(function (forms) {
		// if forms already loaded in DB, carry on
		if (forms.length === fixtures.form.length) {
			cb();
		} else {
			// otherwise, load fixtures for forms
			barrels.populate(['form'], function(err) {
				// after loading form fixtures, create workflows for each
				Form.find().then(function (forms) {
					_.each(forms, function(form) {
						var idx = _.findIndex(fixtures.form, { 'form_name': form.form_name });
						if (fixtures.workflowstate[idx]) {
							fixtures.workflowstate[idx].template.href = [sails.getBaseUrl() + sails.config.blueprints.prefix, 'form', form.id].join('/');	
						}						
					});
				})
				.then(function (data) {
					barrels.populate(['workflowstate'], function (err) {
						cb(err);
					});	  		
				});  	
			});  		
		}
	});
};
