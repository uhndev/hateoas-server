// Until @tjwebb makes this process easier, I'm modifying the hook from node_modules/sails-permissions

var modelRestrictions = {
  coordinator: [
    'Role',
    'Permission',
    'Model',
    'WorkflowState'
  ]
};

module.exports = function (sails) {
  return {
    initialize: function (next) {
      sails.after('hook:sails-permissions:loaded', function () {
        Model.count()
          .then(function (count) {
            if (count == sails.models.length) return next();
            initializeFixtures().then(next);
          })
          .catch(function (error) {
            sails.log.error(error);
            next(error);
          });
      });
    }
  };
};

/**
 * Install the application. Sets up additional Roles and Permissions
 */
function initializeFixtures () {
  return Model.find(
    {
      name: {
        '!': modelRestrictions.coordinator
      }
    })
    .then(function (models) {
      this.models = models;
      sails.log('finding or creating roles for coordinators and subjects');
      return require('../../config/fixtures/role').create();
    })    
    .then(function (roles) {
      this.roles = roles;
      return User.findOne({ email: sails.config.permissions.adminEmail });
    })
    .then(function (admin) {
      sails.log('setting additional permissions for coordinators and subjects');
      return require('../../config/fixtures/permission').create(this.roles, this.models, admin);
    })
    .then(function (permissions) {
      return null;
    })
    .catch(function (error) {
      sails.log.error(error);
    });
}