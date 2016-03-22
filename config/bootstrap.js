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

var _ = require('lodash');

module.exports.bootstrap = function (cb) {
  // Keep Bluebird warnings but don't
  // show those about forgotten returns.
  // They are not nice to have when using promises
  // on policies + controllers + other
  process.env.BLUEBIRD_WARNINGS = 1;
  process.env.BLUEBIRD_W_FORGOTTEN_RETURN = 0;

  knex = require('knex')({
    client: 'pg',
    connection: sails.config.connections[sails.config.models.connection]
  });

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  if (sails.config.models.migrate !== 'safe') {
    WorkflowState.generateAndCreate()
      .then(Site.generateAndCreate)
      .then(StaffType.generateAndCreate)
      .then(Status.generateAndCreate)
      .then(ServiceCategory.generateAndCreate)
      .then(WorkStatus.generateAndCreate)
      .then(Timeframe.generateAndCreate)
      .then(Prognosis.generateAndCreate)
      .then(function () {
        return AltumService.findOrCreate({ name: 'Triage' }, {
          name: 'Triage',
          available: true,
          visitable: true
        }).then(function () {
          sails.log.info("Default Triage AltumService generated");
        });
      })
      .then(cb)
      .catch(cb);
  } else {
    cb();
  }
};
