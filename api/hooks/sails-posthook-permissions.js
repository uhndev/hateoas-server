// Until @tjwebb makes this process easier, I'm modifying the hook from node_modules/sails-permissions

(function() {

module.exports = function (sails) {
  return {
    initialize: function (next) {
      sails.after('hook:sails-permissions:loaded', function () {
        Model.count()
          .then(function (count) {
            if (count == sails.models.length) return next();
            initializeRoles()
              .then(initializeGroups)
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
 * @return {Array} roles
 */
function initializeRoles () {
  sails.log('finding or creating roles');
  return require('../../config/fixtures/role').create();
}

/**
 * Grants admin role and creates default admin person if not set
 * @return {Object} user
 */
function checkAdminUser() {
  return User.findOne({ email: sails.config.permissions.adminEmail })
    .then(function (user) {
      if (_.isUndefined(user.group)) {
        return Group.findOneByName('admin')
          .then(function (group) {
            return User.update({ id: user.id }, {
              prefix: 'Mr.',
              firstname: 'Admin',
              lastname: 'Admin',
              group: group.id
            });
          });
      } else {
        return user;
      }
    });
}

/**
 * Creates associated permission for each created role in previous step
 * @return {Array} permissions
 */
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

/**
 * Creates default groups with their own specific roles
 * @return {Array} groups
 */
function initializeGroups () {
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
      sails.log('setting additional groups');
      return require('../../config/fixtures/groups').create(this.roles, this.models, admin);
    })
    .then(function (groups) {
      return null;
    })
    .catch(function (error) {
      sails.log.error(error);
    });
}

})();

