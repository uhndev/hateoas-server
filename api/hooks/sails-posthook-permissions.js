// Until @tjwebb makes this process easier, I'm modifying the hook from node_modules/sails-permissions

module.exports = function (sails) {
  return {
    initialize: function (next) {
      sails.after('hook:sails-permissions:loaded', function () {
        Model.count()
          .then(function (count) {
            if (count == sails.models.length) return next();
            initializeRoles()
              .then(checkAdminUser)
              .then(initializePermissions)
              .then(next);
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
function initializeRoles () {
  sails.log('finding or creating roles');
  return require('../../config/fixtures/role').create();
}

function checkAdminUser() {
  return User.findOne({ email: sails.config.permissions.adminEmail })
    .then(function (user) {
      return User.update({ id: user.id }, {
        role: 'admin'
      });
    });
}

function initializePermissions () {
  return Model.find()
    .then(function (models) {
      this.models = models;
      return Role.find();
    })
    .then(function (roles) {
      this.roles = roles;
      return User.findOne({ email: sails.config.permissions.adminEmail });
    })
    .then(function (admin) {
      sails.log('setting additional permissions');
      return require('../../config/fixtures/permissions').create(this.roles, this.models, admin);
    })
    .then(function (permissions) {
      return null;
    })
    .catch(function (error) {
      sails.log.error(error);
    });
}
