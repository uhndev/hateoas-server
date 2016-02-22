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
var _ = require('lodash');

module.exports.bootstrap = function (cb) {
  // Keep Bluebird warnings but don't
  // show those about forgotten returns.
  // They are not nice to have when using promises
  // on policies + controllers + other
  process.env.BLUEBIRD_WARNINGS = 1;
  process.env.BLUEBIRD_W_FORGOTTEN_RETURN = 0;

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  // Load fixtures
  var barrels = new Barrels();

  // Save original objects in `fixtures` variable
  fixtures = barrels.data;

  // Populate the DB
  var systemFormNames = _.pluck(fixtures.systemform, 'form_name');
  SystemForm.find({form_name: systemFormNames}).then(function (systemforms) {
    // if forms already loaded in DB, carry on
    if (systemforms.length === fixtures.systemform.length) {
      cb();
    } else {
      // otherwise, load fixtures for forms
      barrels.populate(['systemform'], function (err) {
        // after loading form fixtures, create workflows for each
        SystemForm.find()
          .then(function (systemforms) {
            _.each(systemforms, function (systemform) {
              var idx = _.findIndex(fixtures.systemform, {'form_name': systemform.form_name});
              var workflow = fixtures.workflowstate[idx];
              if (workflow && _.has(workflow.template, 'href')) {
                workflow.template.href = [sails.config.appUrl + sails.config.blueprints.prefix, 'systemform', systemform.id].join('/');
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
